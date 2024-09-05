"use client";

import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ArrowButton({ bottom }: { bottom?: String | Number }) {
  const [isLast, setIsLast] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    window.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => {
      window.removeEventListener("scroll", checkScroll); //clean up
    };
  }, []);

  // url 이 바뀔 때도 체크하기
  useEffect(() => {
    checkScroll();
  }, [pathname]);

  const checkScroll = () => {
    const last =
      Math.ceil(window.scrollY) + window.innerHeight >=
      document.body.scrollHeight;
    setIsLast(last);
  };

  const toggleUpDown = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div
      onClick={toggleUpDown}
      className={`${
        isLast ? "opacity-0" : "opacity-100"
      } transition-opacity ease-in-out fixed right-5 bottom-${
        typeof bottom !== "undefined" ? bottom : "32"
      } primary-btn w-16 h-16 rounded-full flex items-center justify-center [&>svg]:w-7 [&>svg]:h-7`}
    >
      <ArrowDownIcon />
    </div>
  );
}
