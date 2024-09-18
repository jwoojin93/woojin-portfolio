import Link from "next/link";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";


export default function SmsLogin() {
  return (
    <Link
      className="primary-btn flex h-10 items-center justify-center gap-2"
      href="/sms"
    >
      <ChatBubbleOvalLeftEllipsisIcon className="size-6" />
      <span>Continue with SMS</span>
    </Link>
  );
}
