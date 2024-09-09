import ChatRoomList from "@/components/chat-room-list";
import ChatTab from "@/components/chat-tab";
import Title from "@/components/title";
import UserList from "@/components/user-list";

export default async function Chat({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div>
      <Title value="Chat Room" />
      <ChatTab tab={searchParams?.tab} />
      {searchParams?.tab === "chatroom" ? (
        <ChatRoomList />
      ) : (
        <UserList />
      )}
    </div>
  );
}
