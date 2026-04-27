"use client";

import { createContext, useContext } from "react";

type MediaContextType = {
  basePath: string;
};

const BasePathContext = createContext<MediaContextType | null>(null);

export function useBasePath() {
  const ctx = useContext(BasePathContext);
  if (!ctx) throw new Error("useBasePath must be used inside MediaPage");
  return ctx;
}

export default BasePathContext;