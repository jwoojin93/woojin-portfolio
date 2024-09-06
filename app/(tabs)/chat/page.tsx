import Title from "@/components/title";
import db from "@/lib/db";
import getSession from "@/lib/session";
import Image from "next/image";
import Link from "next/link";

export default async function Chat() {
  // 채팅방 리스트 가져오기
  // session id 가 chatroom 의 users 의 id 로 속한 리스트 가져오기
  const session = await getSession();
  const chatRooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: { id: session.id },
      },
    },
    select: {
      users: true,
      id: true,
      messages: true,
    },
  });

  console.log("chatRooms 123: ", chatRooms[0].users);

  return (
    <div>
      <Title value="Chat Room" />
      {chatRooms.length > 0 ? (
        chatRooms.map((chatRoom) => (
          <Link key={chatRoom.id} href={`/chats/${chatRoom.id}`}>
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
                      <p className="text-sm text-black font-semibold">
                        {user.username}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {chatRoom.messages.length > 0
                          ? chatRoom.messages[0].payload
                          : " "}
                      </p>
                    </div>
                  </div>
                )
            )}
          </Link>
        ))
      ) : (
        <p className="text-gray-600 text-sm text-center ">
          채팅방이 없습니다. 게시글 탭에서 게시자와 채팅방을 생성해보세요.
        </p>
      )}
    </div>
  );
}
