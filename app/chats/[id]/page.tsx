import BackButton from "@/components/back-button";
import ChatMessagesList from "@/components/chat-messages-list";
import Header from "@/components/header";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import {
  getChatRoomByUser,
  getMessages,
  getRoom,
  getUserProfile,
} from "./actions";

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id); // ChatRoom id 로 ChatRoom db 를 가져옵니다.
  if (!room) return notFound(); // ChatRoom 이 없으면 404 를 호출합니다.

  const initialMessages = await getMessages(params.id); // ChatRoom id 로 Message db 를 가져옵니다.
  const session = await getSession();

  const user = await getUserProfile(); // 세션과 일치하는 유저 정보를 가져옵니다.
  if (!user) return notFound(); // 세션과 일치하는 유저가 없을 경우 404 를 호출합니다. => 그전에 검증하는데 이 로직이 필요한가?

  const chatRoomByUser = await getChatRoomByUser(params.id);
  console.log("chatRoomByUser: ", chatRoomByUser || "없음");
  if (chatRoomByUser) console.log(chatRoomByUser[0].last_read_at);

  return (
    <>
      <Header>
        <BackButton />
      </Header>
      <ChatMessagesList
        chatRoomId={params.id}
        userId={session.id!}
        username={user.username}
        avatar={user.avatar!}
        initialMessages={initialMessages}
      />
    </>
  );
}
