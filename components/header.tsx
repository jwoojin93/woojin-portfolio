"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Header({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setElement(document.getElementById("header-portal"));
    setMounted(true);
    return () => {
      setElement(null);
      setMounted(false);
    };
  }, []);

  return mounted ? createPortal(children, element as HTMLElement) : <></>;
}
