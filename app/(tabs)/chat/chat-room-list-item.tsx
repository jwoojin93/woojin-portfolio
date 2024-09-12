import { getChatRoomByUser } from "@/app/chats/[id]/actions";
import getSession from "@/lib/session";
import { Message, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { getMessageCount } from "./actions";

interface IChatRoom {
  users: User[];
  id: string;
  messages: Message[];
}

export default async function ChatRoomListItem({
  chatRoom,
}: {
  chatRoom: IChatRoom;
}) {
  const session = await getSession();
  const chatRoomByUser = await getChatRoomByUser(chatRoom.id, session.id!);
  const messagesCount = await getMessageCount(chatRoomByUser);

  return (
    <Link href={`/chats/${chatRoom.id}`}>
      {chatRoom.users.map(
        (user) =>
          user.id !== session.id && (
            <div
              key={user.id}
              className="w-full bg-white shadow-sm rounded-lg px-5 h-20 flex items-center gap-4"
            >
              <div className="size-12 relative">
                <Image
                  src={user.avatar ? user.avatar : "/placeholder.jpg"}
                  alt="user avatar"
                  fill
                  className="rounded-xl"
                />
              </div>
              <div>
                <p className="text-sm text-black font-semibold flex items-center gap-2">
                  {user.username}
                  <span className="bg-orange-500 text-white rounded-full flex items-center justify-center font-normal text-[10px] max-h-[15px] min-w-[15px] ">
                    {messagesCount[0]?._count?.messages}
                  </span>
                </p>
                <p className="text-sm text-neutral-600">
                  {chatRoom.messages.length > 0
                    ? chatRoom.messages[chatRoom.messages.length - 1].payload
                    : " "}
                </p>
              </div>
            </div>
          )
      )}
    </Link>
  );
}
