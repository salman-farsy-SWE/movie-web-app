"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Lock, Globe } from "lucide-react";
import { MoreOptionsButton } from "@/components/MoreOptionsButton";
import { ListOptionsPopup } from "@/components/user-collection/ListOptionsPopup";
import { ShareListModal } from "@/components/user-collection/ShareListModal";
import { DeleteListModal } from "@/components/user-collection/DeleteListModal";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useList } from "@/contexts/ListContext";
import { useUserCollectionsStore } from "@/stores/useUserCollectionsStore";
import { useAuth } from "@/contexts/AuthContext";
import type { UserList } from "@/data/mock-lists";

interface ListProps {
  basePath: string;
  lists?: UserList[];
  emptyMessage?: string;
  onClear?: () => void;
}

const DEFAULT_BACKDROP = "/assets/movie-placeholder.jpg";

export function List({ basePath, lists, emptyMessage, onClear }: ListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [popupPos, setPopupPos] = useState<{ bottom: number; left: number } | null>(null);
  const [shareList, setShareList] = useState<UserList | null>(null);
  const [listPendingDelete, setListPendingDelete] = useState<UserList | null>(null);

  const popupRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const openIndexRef = useRef(openIndex);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragThreshold = 5;

  const { openCreate, openEdit } = useList();
  const { isAuthenticated } = useAuth();

  const customLists = useUserCollectionsStore((state) => state.customLists);
  const deleteCustomList = useUserCollectionsStore((state) => state.deleteCustomList);
  const syncCustomListsFromTmdb = useUserCollectionsStore((state) => state.syncCustomListsFromTmdb);

  const displayedLists = lists ?? customLists;

  useEffect(() => {
    if (isAuthenticated) {
      syncCustomListsFromTmdb();
    }
  }, [isAuthenticated, syncCustomListsFromTmdb]);

  useEffect(() => {
    openIndexRef.current = openIndex;
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;

    const update = () => {
      const activeBtn = btnRefs.current[openIndex];
      if (!activeBtn) return;
      const btnRect = activeBtn.getBoundingClientRect();
      const h = window.innerHeight;
      setPopupPos({ bottom: h - btnRect.top + 7, left: btnRect.right });
    };

    const raf = requestAnimationFrame(update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [openIndex]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (openIndexRef.current === null) return;
      if (popupRef.current?.contains(e.target as Node)) return;
      const currentBtn = btnRefs.current[openIndexRef.current];
      if (currentBtn && currentBtn.contains(e.target as Node)) return;

      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMove = (e: PointerEvent) => {
      if (!dragStartRef.current) return;
      const dx = Math.abs(e.clientX - dragStartRef.current.x);
      const dy = Math.abs(e.clientY - dragStartRef.current.y);
      if (dx > dragThreshold || dy > dragThreshold) {
        setOpenIndex(null);
        dragStartRef.current = null;
      }
    };

    const onUp = () => {
      dragStartRef.current = null;
    };

    const onClick = (e: MouseEvent) => {
      if (openIndexRef.current === null) return;
      const currentBtn = btnRefs.current[openIndexRef.current];
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        !currentBtn?.contains(e.target as Node)
      ) {
        setOpenIndex(null);
      }
    };

    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const activeList = openIndex !== null ? displayedLists[openIndex] : null;

  const handleDeleteRequest = (list: UserList) => {
    const itemCount = (list.items && list.items.length > 0) ? list.items.length : (list.itemCount || 0);
    if (itemCount > 0) {
      setListPendingDelete(list);
    } else {
      deleteCustomList(list.id);
    }
  };

  const handleConfirmDelete = () => {
    if (!listPendingDelete) return;
    const targetId = listPendingDelete.id;
    setListPendingDelete(null);
    deleteCustomList(targetId);
  };

  return (
    <div className="w-full">
      {/* Options Popup Portal */}
      {openIndex !== null && popupPos && activeList && createPortal(
        <div
          ref={popupRef}
          className="fixed z-50 origin-bottom-right"
          style={{
            bottom: popupPos.bottom,
            left: popupPos.left,
            transform: "translateX(-100%)",
          }}
        >
            <ListOptionsPopup
              isPrivate={activeList.isPrivate}
              onEdit={() => {
                const listToEdit = activeList;
                setOpenIndex(null);
                openEdit(listToEdit);
              }}
              onShare={() => {
                const listToShare = activeList;
                setOpenIndex(null);
                setShareList(listToShare);
              }}
              onDelete={() => {
                const listToDelete = activeList;
                setOpenIndex(null);
                handleDeleteRequest(listToDelete);
              }}
              onClose={() => setOpenIndex(null)}
            />
        </div>,
        document.body
      )}

      {/* Share List Modal */}
      <ShareListModal
        open={!!shareList}
        onClose={() => setShareList(null)}
        list={shareList}
        customUrl={
          shareList && typeof window !== "undefined"
            ? `${window.location.origin}${basePath.replace(/\/+$/, "")}/${shareList.slug || shareList.id}`
            : undefined
        }
      />

      {/* Delete List Confirmation Modal */}
      <DeleteListModal
        open={!!listPendingDelete}
        onClose={() => setListPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        listTitle={listPendingDelete?.title || "this list"}
      />

      {/* Create New Button */}
      <div className="mt-5 sm:mt-6">
        <Button
          onClick={() => openCreate()}
          className="h-[36px] sm:h-[38px] px-3.5 sm:px-4 rounded-[6px] sm:rounded-[8px] bg-light-create-new-btn hover:bg-light-create-new-btn/90 dark:bg-create-new-btn dark:hover:bg-create-new-btn/90 text-white font-inter font-medium text-[13px] sm:text-[14px] flex items-center gap-1.5 border-none shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <span>Create new</span>
          <Plus strokeWidth={2.5} className="w-4 h-4" />
        </Button>
      </div>

      {/* Movie List Grid */}
      {displayedLists.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-light-genre-font dark:text-genre-font font-inter text-sm md:text-base">
          <p>{emptyMessage || "You haven't created any lists yet. Click \"Create new\" to build your first collection!"}</p>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="mt-1 h-8 px-4 rounded-full text-xs font-inter font-medium text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-7 gap-y-7 sm:gap-y-9 lg:gap-y-10 pb-12">
          {displayedLists.map((list, i) => {
            const mostRecentItem = list.items && list.items.length > 0 ? list.items[0] : null;
            const coverImage =
              mostRecentItem?.backdropImage ||
              list.backdrop ||
              DEFAULT_BACKDROP;
            const href = `${basePath.replace(/\/+$/, "")}/${list.slug || list.id}`;

            return (
              <div key={list.id} className="flex flex-col w-full">
                {/* Cover Image Frame */}
                <Link
                  href={href}
                  className="group/image relative block w-full aspect-[16/10] rounded-[8px] overflow-hidden bg-black/10 dark:bg-white/5 shadow-xs"
                >
                  <Image
                    src={coverImage}
                    alt={list.title}
                    fill
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    className="object-cover object-center select-none"
                    sizes="(max-width: 700px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />

                  {/* Dark dimming overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 dark:group-hover/image:bg-black/10 transition-colors duration-150 pointer-events-none" />

                  {/* Subtle gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Item Count & Privacy Badge */}
                  <div className="absolute right-3 bottom-2 flex items-center gap-1.5 select-none pointer-events-none">
                    {list.isPrivate ? (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-amber-300 font-inter text-[11px] font-medium border border-amber-500/30">
                        <Lock className="w-3 h-3" />
                        Private
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-emerald-300 font-inter text-[11px] font-medium border border-emerald-500/30">
                        <Globe className="w-3 h-3" />
                        Public
                      </span>
                    )}
                    <span className="text-white font-inter font-medium text-[13px] sm:text-[14px] drop-shadow-sm">
                      {list.itemCount} {list.itemCount === 1 ? "Item" : "Items"}
                    </span>
                  </div>
                </Link>

                {/* Title and Options Action */}
                <div className="flex items-start justify-between gap-2 mt-2.5 relative">
                  <Link href={href} className="group/title flex-1 min-w-0">
                    <h3 className="font-inter font-semibold sm:font-medium text-[15px] sm:text-[16px] text-black/90 dark:text-white/90 group-hover/title:text-black dark:group-hover/title:text-white transition-colors duration-150 truncate leading-snug">
                      {list.title}
                    </h3>
                  </Link>

                  <div className="relative shrink-0">
                    <MoreOptionsButton
                      ref={(el) => {
                        btnRefs.current[i] = el;
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenIndex((prev) => (prev === i ? null : i));
                      }}
                      className="w-7 h-7 rounded-full hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer -mr-1.5"
                      className2="w-4 h-4 text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors"
                    />
                  </div>
                </div>

                {/* List Description */}
                {list.description && (
                  <p className="mt-1 font-inter text-[12px] sm:text-[13px] text-light-mylist-description dark:text-mylist-description leading-relaxed line-clamp-2">
                    {list.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}