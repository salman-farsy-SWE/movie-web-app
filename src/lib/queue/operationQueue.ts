
type Task<T = unknown> = () => Promise<T>;

interface PendingState<T> {
  desiredValue: T;
  syncFn: (value: T) => Promise<{ success: boolean; isTmdbSynced?: boolean; error?: string }>;
  onRollback?: (failedValue: T) => void;
  resolve: (res: boolean) => void;
  reject: (err: unknown) => void;
}

class OperationQueueManager {
  private promiseChains = new Map<string, Promise<unknown>>();
  private stateCoalescers = new Map<string, {
    inFlight: boolean;
    currentCommittedValue: unknown;
    pending?: PendingState<unknown>;
  }>();

  // Registry for tracking async list ID resolutions (e.g., custom-list-123 -> real tmdb listId 98234)
  private listIdResolutions = new Map<string, string>();
  private listResolutionPromises = new Map<string, Promise<string>>();

  /**
   * Enqueues a generic task under a specific key.
   * Tasks with the same key will execute sequentially in FIFO order.
   * Tasks with different keys run concurrently.
   */
  async enqueue<T>(key: string, task: Task<T>): Promise<T> {
    const prevPromise = this.promiseChains.get(key) || Promise.resolve();

    let resolveTask!: (val: T) => void;
    let rejectTask!: (err: unknown) => void;
    const taskPromise = new Promise<T>((res, rej) => {
      resolveTask = res;
      rejectTask = rej;
    });

    const nextPromise = prevPromise
      .catch(() => {}) // Don't let previous failures block subsequent tasks
      .then(async () => {
        try {
          const result = await task();
          resolveTask(result);
        } catch (err) {
          rejectTask(err);
        }
      })
      .finally(() => {
        if (this.promiseChains.get(key) === nextPromise) {
          this.promiseChains.delete(key);
        }
      });

    this.promiseChains.set(key, nextPromise);
    return taskPromise;
  }

 
  async syncState<T>({
    key,
    desiredValue,
    syncFn,
    onRollback,
  }: {
    key: string;
    desiredValue: T;
    syncFn: (value: T) => Promise<{ success: boolean; isTmdbSynced?: boolean; error?: string }>;
    onRollback?: (failedValue: T) => void;
  }): Promise<boolean> {
    let entry = this.stateCoalescers.get(key);
    if (!entry) {
      entry = {
        inFlight: false,
        currentCommittedValue: undefined,
      };
      this.stateCoalescers.set(key, entry);
    }

    return new Promise<boolean>((resolve, reject) => {
      if (entry) {
        entry.pending = {
          desiredValue,
          syncFn: syncFn as (value: unknown) => Promise<{ success: boolean; isTmdbSynced?: boolean; error?: string }>,
          onRollback: onRollback as ((failedValue: unknown) => void) | undefined,
          resolve,
          reject,
        };
      }

      this.processStateQueue(key);
    });
  }

  private async processStateQueue(key: string) {
    const entry = this.stateCoalescers.get(key);
    if (!entry || entry.inFlight || !entry.pending) {
      return;
    }

    const currentPending = entry.pending;
    entry.pending = undefined;
    entry.inFlight = true;

    const valueToSync = currentPending.desiredValue;

    try {
      const res = await currentPending.syncFn(valueToSync);
      entry.currentCommittedValue = valueToSync;

      if (!res.success && res.isTmdbSynced !== false) {
        // Only trigger rollback if user hasn't queued a newer desired state in the meantime
        if (!entry.pending && currentPending.onRollback) {
          currentPending.onRollback(valueToSync);
        }
      }

      currentPending.resolve(res.success);
    } catch (err) {
      if (!entry.pending && currentPending.onRollback) {
        currentPending.onRollback(valueToSync);
      }
      currentPending.reject(err);
    } finally {
      entry.inFlight = false;
      const latestEntry = this.stateCoalescers.get(key);
      const nextPending = latestEntry?.pending;

      // If a newer pending state arrived while the request was in flight
      if (nextPending && latestEntry) {
        // If the pending value is identical to what we just committed, we can resolve immediately!
        if (nextPending.desiredValue === latestEntry.currentCommittedValue) {
          latestEntry.pending = undefined;
          nextPending.resolve(true);
        } else {
          this.processStateQueue(key);
        }
      } else {
        // Cleanup if no longer needed
        this.stateCoalescers.delete(key);
      }
    }
  }

  
  registerListCreation(localId: string, creationPromise: Promise<string | number | undefined>) {
    const promise = creationPromise
      .then((realId) => {
        if (realId) {
          const realIdStr = String(realId);
          this.listIdResolutions.set(localId, realIdStr);
          this.listIdResolutions.set(`list-${localId}`, realIdStr);
          return realIdStr;
        }
        return localId;
      })
      .catch(() => localId);

    this.listResolutionPromises.set(localId, promise);
    this.listResolutionPromises.set(`list-${localId}`, promise);
  }

  async resolveListId(listId: string | number): Promise<string> {
    const idStr = String(listId);
    if (this.listIdResolutions.has(idStr)) {
      return this.listIdResolutions.get(idStr)!;
    }

    const pendingPromise = this.listResolutionPromises.get(idStr);
    if (pendingPromise) {
      return await pendingPromise;
    }

    return idStr;
  }

  
  isKeyPending(key: string): boolean {
    if (this.promiseChains.has(key)) return true;
    const entry = this.stateCoalescers.get(key);
    return Boolean(entry && (entry.inFlight || entry.pending));
  }

  getPendingDesiredValue<T = unknown>(key: string): T | undefined {
    const entry = this.stateCoalescers.get(key);
    if (entry?.pending) {
      return entry.pending.desiredValue as T;
    }
    return undefined;
  }

  hasPendingPrefix(prefix: string): boolean {
    for (const key of this.promiseChains.keys()) {
      if (key.startsWith(prefix)) return true;
    }
    for (const [key, entry] of this.stateCoalescers.entries()) {
      if (key.startsWith(prefix) && (entry.inFlight || entry.pending)) {
        return true;
      }
    }
    return false;
  }

  cancelListOperations(listId: string | number) {
    const idStr = String(listId);
    const cleanId = idStr.replace(/^list-/, "");

    this.promiseChains.delete(`list:${idStr}`);
    this.promiseChains.delete(`list:${cleanId}`);
    this.stateCoalescers.delete(`list:${idStr}`);
    this.stateCoalescers.delete(`list:${cleanId}`);
    this.listIdResolutions.delete(idStr);
    this.listIdResolutions.delete(cleanId);
    this.listResolutionPromises.delete(idStr);
    this.listResolutionPromises.delete(cleanId);
  }
}

export const operationQueue = new OperationQueueManager();

