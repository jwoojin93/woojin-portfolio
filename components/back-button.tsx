"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  return (
    <div
      onClick={goBack}
      className="w-16 h-16 flex items-center justify-center [&>svg]:w-7 [&>svg]:h-7 [&>svg]:text-orange-800"
    >
      <ArrowLeftIcon />
    </div>
  );
}
