"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

export async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: { id: session.id! },
    select: {
      username: true,
      avatar: true,
    },
  });
  return user;
}

export async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: { chatRoomId },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}

export async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: { id },
    include: {
      users: { select: { id: true } },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    if (!canSee) return null;
  }
  return room;
}

export async function getChatRoomByUser(chatRoomId: string) {
  const session = await getSession();
  const chatRoomReadByUser = await db.chatRoomByUser.findMany({
    where: {
      user: {
        id: session.id,
      },
      ChatRoom: {
        id: chatRoomId,
      },
    },
  });
  return chatRoomReadByUser;
}
