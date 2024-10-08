"use client";

import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ArrowButton({ bottom }: { bottom?: String }) {
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
    if (isLast) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div
      onClick={toggleUpDown}
      // className={`${
      //   isLast ? "opacity-0" : "opacity-100"
      // } transition-opacity ease-in-out fixed right-5 ${bottom || "bottom-28"}
      // } primary-btn w-16 h-16 rounded-full flex items-center justify-center [&>svg]:w-7 [&>svg]:h-7`}
      className={`transition-opacity ease-in-out fixed right-5 ${
        bottom || "bottom-28"
      }
      } primary-btn w-16 h-16 rounded-full flex items-center justify-center [&>svg]:w-7 [&>svg]:h-7`}
    >
      {isLast ? <ArrowUpIcon /> : <ArrowDownIcon />}
    </div>
  );
}
