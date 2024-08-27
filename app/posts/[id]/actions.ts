"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

/**
 * 좋아요 추가 기능
 * 게시물 id 와, 유저 id 를 가져와서 like database 를 생성합니다.
 * like-statis-[postId] tag 를 사용하여 cache 를 초기화 합니다.
 * @param postId
 */
export async function likePost(postId: number) {
  // await new Promise((r) => setTimeout(r, 10000));
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
  // await new Promise((r) => setTimeout(r, 10000));
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
