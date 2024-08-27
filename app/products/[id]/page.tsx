import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import getSession from "@/lib/session";

/**
 * product 를 생산한 유저가 현재 접속한 유저와 일치하는 지 확인.
 * @param userId
 * @returns
 */
async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) return session.id === userId;
  return false;
}

/**
 * product id 로 product 가져오기
 * @param id product id
 * @returns product
 */
async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      user: {
        select: { username: true, avatar: true },
      },
    },
  });
  return product;
}

/**
 * 제품 상세 정보 가져올 때 next cache 처리
 * product-detail 이라는 key 에 cache 를 저장한다.
 * product-detail 이라는 tag 를 생성하여 cache 를 refresh 할 수 있도록 한다.
 */
const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

/**
 * product id 로 제품 이름 가져오기
 * @param id product id
 * @returns product
 */
async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    select: { title: true },
  });
  return product;
}

/**
 * product 제목 가져올 때 next cache 처리
 * product-title 이라는 키로 cache 를 저장한다.
 * product-title 이라는 tag 로 cache 를 refresh 할 수 있도록 정의한다.
 */
const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title"],
});

/**
 * 동적 meatadata 설정하기
 * @param param0
 * @returns
 */
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  // product id 가 없으면 not found
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  // product 가 없으면 not found
  const product = await getCachedProduct(id);
  if (!product) notFound();

  // 현재 product 가 접속한 유저의 product 인지 확인.
  const isOwner = await getIsOwner(product.userId);

  /**
   * 'xxxx' 라는 이름의 tag 로 된 cache 들을 초기화한다.
   * 현재 'xxxx' 라는 이름의 cache 가 없기 때문에 동작하지 않을 거로 판단됨.
   */
  const revalidate = async () => {
    "use server";
    revalidateTag("xxxx");
  };

  /**
   * 채팅방 만들기
   * 1. 제품의 유저 아이디와, 현재 접속중인 유저 아이디를 조합하여 채팅방 id 를 만든다.
   * 2. 채팅방이 만들어지면 해당 채팅방으로 이동한다.
   */
  const createChatRoom = async () => {
    "use server";
    const session = await getSession();
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [{ id: product.userId }, { id: session.id }],
        },
      },
      select: { id: true },
    });
    redirect(`/chats/${room.id}`);
  };

  return (
    <div className="pb-40">
      <div className="relative aspect-square">
        <Image
          className="object-cover"
          fill
          src={`${product.photo}`}
          alt={product.title}
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0  p-5 pb-10 bg-neutral-800 flex justify-between items-center max-w-screen-sm">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <form action={revalidate}>
            <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
              Revalidate title cache
            </button>
          </form>
        ) : null}
        <form action={createChatRoom}>
          <button className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
            채팅하기
          </button>
        </form>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: { id: true },
  });

  return products.map((product) => ({ id: product.id + "" }));
}
