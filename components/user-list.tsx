import db from "@/lib/db";
import getSession from "@/lib/session";
import Image from "next/image";

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
          className="w-full bg-white shadow-sm rounded-lg px-5 h-20 flex items-center gap-4"
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

          <div className="primary-btn !w-[95px]">채팅하기</div>
        </div>
      ))}
    </div>
  ) : (
    <div></div>
  );
}
