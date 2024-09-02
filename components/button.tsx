"use client";

import { useFormStatus } from "react-dom";
import LoadingSpinner from "./loading-spinner";

interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="primary-btn disabled:bg-neutral-400  disabled:text-neutral-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          Loading <LoadingSpinner className="" />
        </>
      ) : (
        text
      )}
    </button>
  );
}
