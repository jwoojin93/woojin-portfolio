"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const title = z.string();

/**
 * 스트리밍 시작하기
 * @param _
 * @param formData
 * @returns
 */
export async function startStream(_: any, formData: FormData) {
  const results = title.safeParse(formData.get("title"));

  // title 스키마가 비정상일 경우 에러를 반환합니다.
  if (!results.success) return results.error.flatten();

  // title 스키마가 정상일 경우 cloudflare accound id 를 이용하여 스트리밍을 시작합니다..?
  // live_inputs 의 기능이 뭐였지?
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}` },
      body: JSON.stringify({
        meta: { name: results.data },
        recording: { mode: "automatic" },
      }),
    }
  );

  const data = await response.json();
  const session = await getSession();

  // liveStream 데이터베이스 컬럼을 생성합니다.
  // title, steam_id, stream_key, userId 가 포함됩니다.
  // stream id 를 반환합니다.
  const stream = await db.liveStream.create({
    data: {
      title: results.data,
      stream_id: data.result.uid,
      stream_key: data.result.rtmps.streamKey,
      userId: session.id!,
    },
    select: { id: true },
  });

  // liveStream 데이터베이스 컬럼 생성이 완료되면 strema id 를 이용하여 스트리밍 상세 페이지로 이동합니다.
  redirect(`/streams/${stream.id}`);
}
