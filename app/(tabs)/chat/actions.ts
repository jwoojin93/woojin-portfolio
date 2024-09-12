"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

interface IChatRoomUser {
  id: number;
  userId: number;
  last_read_at: Date;
  chatRoomId: string;
}

/**
 * 세션 유저의 안읽은 리스트 가져오기
 * last_read_at 이후로 현재 쌓인 messages 가 몇 개인지 가져오기
 * @param chatRoomByUser
 * @returns
 */
export async function getMessageCount(chatRoomByUser: IChatRoomUser) {
  const session = await getSession();

  const messagesCount = await db.chatRoom.findMany({
    where: {
      AND: [
        {
          ChatRoomByUser: {
            some: { userId: session.id },
          },
        },
        {
          messages: {
            some: {
              created_at: {
                gte: new Date(chatRoomByUser.last_read_at),
              },
            },
          },
        },
      ],
    },
    include: {
      _count: {
        select: { messages: true },
      },
    },
  });

  return messagesCount;
}
