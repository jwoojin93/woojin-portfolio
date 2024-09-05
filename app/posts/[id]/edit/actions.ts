"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { postSchema } from "./schema";

/**
 * post id 를 이용하여 post 를 가져옵니다.
 * @param id
 * @returns post
 */
export async function getPost(id: number) {
  try {
    const post = await db.post.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        photo: true,
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

/**
 * 제품 업로드 이벤트
 * @param formData
 * @returns
 */
export async function updatePost(formData: FormData, postId: number) {
  // photo, title, price, description 정보를 담은 data 를 만든다.
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  // data 를 postSchema 에 safeParse 한다.
  // zod 의 safeParse 가 뭐였지?
  const result = postSchema.safeParse(data);

  if (!result.success) {
    // 결과가 정상이 아닐경우 에러를 반환한다.
    return result.error.flatten();
  } else {
    // 결과가 정상일 경우 title, description, price, photo, user 가 들어있는 post database 를 생성한다.
    // 처리가 완료되면 생성된 post id 를 이용하여 post 상세페이지로 redirect 한다.
    const session = await getSession();
    if (session.id) {
      await db.post.update({
        where: { id: postId },
        data: {
          title: result.data.title,
          description: result.data.description,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
      });
      redirect(`/post`);
    }
  }
}

/**
 * cloudflare upload url 받아오기
 * cloudflare account id 를 넣어 direct upload url 을 요청한다.
 * TODO(woojin): cloudfalre 의 direct upload url 의 기능이 뭐였지? 그냥 upload url 과 무슨 차이였지?
 * @returns
 */
export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}` },
    }
  );
  const data = await response.json();
  return data;
}
