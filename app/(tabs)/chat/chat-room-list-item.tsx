import { getChatRoomByUser } from "@/app/chats/[id]/actions";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Message, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

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

  const chatRoomByUser = await getChatRoomByUser(chatRoom.id);
  console.log("chatRoomByUser 22: ", chatRoomByUser || "없음");
  if (chatRoomByUser) console.log(chatRoomByUser[0].last_read_at);

  // 세션 유저의 안읽은 리스트 가져오기
  // last_read_at 이후로 현재 쌓인 messages 가 몇 개인지 가져오기
  // 뒤에서부터 조회

  // 모든 messages 가져오는 조건에 last_read_at 이후로 가져오는 조건절 추가하기
  const messagesCount = await db.chatRoom.findMany({
    where: {
      AND: [
        // {
        //   users: {
        //     some: {
        //       id: session.id,
        //     },
        //   },
        // },
        // {
        //   ChatRoomByUser: {
        //     some: {
        //       last_read_at: {
        //         lte: new Date("2022-01-30"),
        //       },
        //     },
        //   },
        // },
      ],
    },

    include: {
      _count: {
        select: { messages: true },
      },
    },
  });

  console.log("messagesCount 22: ", messagesCount);

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
                    1
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
