"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { productSchema } from "./schema";

/**
 * 제품 업로드 이벤트
 * @param formData
 * @returns
 */
export async function uploadProduct(formData: FormData) {
  // photo, title, price, description 정보를 담은 data 를 만든다.
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  // data 를 productSchema 에 safeParse 한다.
  // zod 의 safeParse 가 뭐였지?
  const result = productSchema.safeParse(data);

  if (!result.success) {
    // 결과가 정상이 아닐경우 에러를 반환한다.
    return result.error.flatten();
  } else {
    // 결과가 정상일 경우 title, description, price, photo, user 가 들어있는 product database 를 생성한다.
    // 처리가 완료되면 생성된 product id 를 이용하여 product 상세페이지로 redirect 한다.
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/products/${product.id}`);
    }
  }
}

/**
 * cloudflare upload url 받아오기
 * cloudflare account id 를 넣어 direct upload url 을 요청한다.
 * cloudfalre 의 direct upload url 의 기능이 뭐였지? 그냥 upload url 과 무슨 차이였지?
 * @returns
 */
export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return data;
}
