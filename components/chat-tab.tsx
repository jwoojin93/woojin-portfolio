import Link from "next/link";

export default function ChatTab({
  tab,
}: {
  tab?: string | string[] | undefined;
}) {
  return (
    <div className="mb-5 flex gap-2 *:flex-1 *:text-center *:p-4 *:font-semibold *:text-neutral-500 *:border-neutral-400 *:border-b-2">
      <Link
        href="/chat?tab=user"
        className={
          tab === "user" || tab === undefined
            ? "!text-orange-500 !border-orange-500"
            : ""
        }
      >
        User List
      </Link>
      <Link
        href="/chat?tab=chatroom"
        className={
          tab === "chatroom" ? "!text-orange-500 !border-orange-500" : ""
        }
      >
        ChatRoom List
      </Link>
    </div>
  );
}
