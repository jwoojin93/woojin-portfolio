"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Header({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const element = document.getElementById("header-portal");
  return mounted ? createPortal(children, element as HTMLElement) : <></>;
}
