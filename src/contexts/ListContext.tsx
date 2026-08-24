"use client";

import { createContext, useContext, useState } from "react";

type ListContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ListContext = createContext<ListContextType | null>(null);

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <ListContext.Provider value={{ open, setOpen }}>
      {children}
    </ListContext.Provider>
  );
}

export function useList() {
  const ctx = useContext(ListContext);
  if (!ctx) throw new Error("useCreateList must be used inside provider");
  return ctx;
}