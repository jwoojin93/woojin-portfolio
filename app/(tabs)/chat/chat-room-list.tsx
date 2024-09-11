import db from "@/lib/db";
import getSession from "@/lib/session";
import ChatRoomListItem from "./chat-room-list-item";

export default async function ChatRoomList() {
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

  return chatRooms.length > 0 ? (
    <div className="flex flex-col gap-3">
      {chatRooms.map((chatRoom) => (
        <ChatRoomListItem key={chatRoom.id} chatRoom={chatRoom} />
      ))}
    </div>
  ) : (
    <p className="text-gray-600 text-sm text-center ">
      채팅방이 없습니다. <br />
      1. User List 에서 원하는 유저와 채팅을 시작해보세요 <br />
      2. 게시글 탭에서 게시자와 채팅방을 시작해보세요.
    </p>
  );
}
