import ChatTab from "@/components/chat-tab";
import Title from "@/components/title";
import UserList from "@/app/(tabs)/chat/user-list";
import ChatRoomList from "@/app/(tabs)/chat/chat-room-list";

export default async function Chat({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div>
      <Title value="Chat Room" />
      <ChatTab tab={searchParams?.tab} />
      {searchParams?.tab === "chatroom" ? <ChatRoomList /> : <UserList />}
    </div>
  );
}
