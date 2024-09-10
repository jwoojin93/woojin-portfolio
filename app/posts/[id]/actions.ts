"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";

interface IPost {
  user: {
    username: string;
    avatar: string | null;
  };
  _count: {
    comments: number;
  };
  id: number;
  userId: number;
}

const createRoomByUser = async (userId: number, roomId: string) => {
  await db.chatRoomByUser.create({
    data: {
      user: {
        connect: { id: userId },
      },
      ChatRoom: {
        connect: { id: roomId },
      },
      last_read_at: new Date(),
    },
  });
};

const createChatRoom = async (userId: number, sessionId: number) => {
  const room = await db.chatRoom.create({
    data: {
      users: {
        connect: [{ id: userId }, { id: sessionId }],
      },
    },
    select: { id: true },
  });
  return room;
};

/**
 * 채팅방 만들기
 */
export const connectChatRoom = async (userId: number) => {
  "use server";

  const session = await getSession(); // 세션 가져오기

  // 유저간에 생성했던 채팅방이 있는 지 확인합니다.
  const result = await db.chatRoom.findMany({
    where: {
      AND: [
        { users: { some: { id: userId } } },
        { users: { some: { id: session.id } } },
      ],
    },
    select: {
      id: true,
    },
  });

  if (result.length > 0) {
    // 기존에 유저간에 생성된 채팅방이 있을 경우 해당 채팅방으로 이동합니다.
    redirect(`/chats/${result[0].id}`);
  } else {
    // post 의 user id 와 접속중인 user id 를 이용하여 chatRoom 데이터베이스 컬럼을 생성합니다.
    const room = await createChatRoom(userId, session.id!);

    // 유저별 채팅방 데이터베이스를 생성합니다. (안읽은 메시지 처리용)
    createRoomByUser(userId, room.id);
    createRoomByUser(session.id!, room.id);

    // chatRoom 데이터베이스 컬럼이 생성되면 id 를 이용하여 채팅방으로 이동합니다.
    redirect(`/chats/${room.id}`);
  }
};

/**
 * 게시글을 삭제하고 게시글 탭으로 이동합니다.
 */
export const deletePost = async (post: IPost) => {
  "use server";
  await db.post.delete({
    where: { id: post.id },
    select: { id: true },
  });
  redirect(`/post`);
};

/**
 * 게시글을 가져올 때 next cache 를 사용합니다.
 * post-detail 이라는 key 를 사용하여 cache 를 저장합니다.
 * post-detail 이라는 tag 를 사용하여 cache 를 초기화 할 수 있도록 합니다.
 * 60초 마다 캐시를 초기화합니다.
 */
export const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
});

/**
 * 좋아요 가져오기를 할 때 next cache 를 사용합니다.
 * post-like-status 라는 key 를 사용하여 cache 를 저장합니다.
 * lite-status-[postId] 라는 tag 를 정의하여 cache 를 초기화 할 수 있도록 합니다.
 * @param postId
 * @returns
 */
export async function getCachedLikeStatus(postId: number) {
  const session = await getSession();

  const cachedOperation = nextCache(
    () => getLikeStatus(postId, session.id!),
    ["post-like-status"],
    {
      tags: [`like-status-${postId}`],
    }
  );
  return cachedOperation();
}

/**
 * post 를 생산한 유저가 현재 접속한 유저와 일치하는 지 확인.
 * @param userId
 * @returns
 */
export async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) return session.id === userId;
  return false;
}

/**
 * post id 를 이용하여 post 를 가져옵니다.
 * @param id
 * @returns post
 */
export async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

/**
 * post id 를 이용하여 좋아요 상태를 가져옵니다.
 * @param postId
 * @returns
 */
export async function getLikeStatus(postId: number, sessionId: number) {
  // post id 와 user id 를 사용하여 like 여부를 조회합니다.
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: sessionId,
      },
    },
  });

  // like database 의 수를 조회합니다.
  const likeCount = await db.like.count({
    where: { postId },
  });

  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

/**
 * 좋아요 추가 기능
 * 게시물 id 와, 유저 id 를 가져와서 like database 를 생성합니다.
 * like-statis-[postId] tag 를 사용하여 cache 를 초기화 합니다.
 * @param postId
 */
export async function likePost(postId: number) {
  const session = await getSession();

  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

/**
 * 좋아요 삭제 기능
 * 게시물 id 와, 유저 id 를 가져와서 like database 를 삭제합니다.
 * like-statis-[postId] tag 를 사용하여 cache 를 초기화 합니다.
 * @param postId
 */
export async function dislikePost(postId: number) {
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}
