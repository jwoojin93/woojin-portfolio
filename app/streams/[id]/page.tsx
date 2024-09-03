import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";

/**
 * steam id 를 이용하여 stream 을 가져옵니다.
 * @param id strema id
 * @returns
 */
async function getStream(id: number) {
  const stream = await db.liveStream.findUnique({
    where: { id },
    select: {
      title: true,
      stream_key: true,
      stream_id: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return stream;
}

// 스트리밍 상세 페이지 입니다.
export default async function StreamDetail({
  params,
}: {
  params: { id: string };
}) {
  // staem id 가 없을 경우 not found 를 호출한다.
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  // stream 이 없을 겨웅 notfound 를 호출한다.
  const stream = await getStream(id);
  if (!stream) return notFound();

  const session = await getSession(); // 세션 가져오기

  return (
    <div className="p-10">
      <div className="relative aspect-video">
        <iframe
          src={`https://${process.env.CLOUDFLARE_DOMAIN}/dc98714ad120275903d1c681fa987fbc/iframe`}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          className="w-full h-full rounded-md"
        ></iframe>
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {stream.user.avatar !== null ? (
            <Image
              src={stream.user.avatar}
              width={40}
              height={40}
              alt={stream.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{stream.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{stream.title}</h1>
      </div>
      {stream.userId === session.id! ? (
        <div className="bg-yellow-200 text-black p-5 rounded-md">
          <div className="flex gap-2">
            <span className="font-semibold">Stream URL:</span>
            <span>rtmps://live.cloudflare.com:443/live/</span>
          </div>
          <div className="flex  flex-wrap">
            <span className="font-semibold">Secret Key:</span>
            <span>{stream.stream_key}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
