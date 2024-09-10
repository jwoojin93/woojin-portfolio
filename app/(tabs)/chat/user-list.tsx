import db from "@/lib/db";
import getSession from "@/lib/session";
import Image from "next/image";
import { ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon } from "@heroicons/react/24/solid";
import { connectChatRoom } from "@/app/posts/[id]/actions";

export default async function UserList() {
  const session = await getSession();

  const users = await db.user.findMany({
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  });

  return users.length > 0 ? (
    <div className="flex flex-col gap-3">
      {users.map((user) => (
        <div
          key={user.id}
          className={
            user.id === session.id
              ? "hidden"
              : "w-full bg-white shadow-sm rounded-lg px-5 h-20 flex items-center gap-4"
          }
        >
          <div className="flex items-center gap-3">
            <div className="w-[50px] h-[50px]">
              <Image
                src={user.avatar || "/placeholder.jpg"}
                alt="user avatar"
                width={50}
                height={50}
                className="w-[50px] h-[50px] object-cover rounded-2xl"
              />
            </div>
            <p>{user.username}</p>
          </div>

          <div className="flex-1"></div>

          {/* 채팅방 이동하기 버튼 (채팅방이 있으면 그 채팅방으로 이동, 채팅방이 없으면 만들고 이동, 예전에 만들어놓은 함수 공통부분으로 빼서 이용하기) */}
          {/* 게시글 상세 페이지의 채팅하기 버튼 기능 활용. */}
          <form action={connectChatRoom.bind(null, user.id)}>
            <button className="primary-btn !w-auto [&>svg]:w-7 [&>svg]:h-7">
              <SolidChatIcon />
            </button>
          </form>
        </div>
      ))}
    </div>
  ) : (
    <div></div>
  );
}
