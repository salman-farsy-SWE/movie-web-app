"use client";

import { createContext, useContext, useState } from "react";
import type { UserList } from "@/data/mock-lists";

type ListContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingList: UserList | null;
  setEditingList: React.Dispatch<React.SetStateAction<UserList | null>>;
  openCreate: () => void;
  openEdit: (list: UserList) => void;
  close: () => void;
};

const ListContext = createContext<ListContextType | null>(null);

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [editingList, setEditingList] = useState<UserList | null>(null);

  const openCreate = () => {
    setEditingList(null);
    setOpen(true);
  };

  const openEdit = (list: UserList) => {
    setEditingList(list);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditingList(null);
  };

  return (
    <ListContext.Provider
      value={{
        open,
        setOpen,
        editingList,
        setEditingList,
        openCreate,
        openEdit,
        close,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

export function useList() {
  const ctx = useContext(ListContext);
  if (!ctx) throw new Error("useList must be used inside ListProvider");
  return ctx;
}