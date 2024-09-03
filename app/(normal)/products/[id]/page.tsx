import db from "@/lib/db";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import getSession from "@/lib/session";

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

// product 상세 페이지입니다.
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

  console.log("product: ", product);

  return <div className="pb-40"></div>;
}

export async function generateStaticParams() {
  // product 들을 가져옵니다.
  const products = await db.product.findMany({
    select: { id: true },
  });

  // product 들을 id 만 string 화 하여 넘겨줍니다.
  return products.map((product) => ({ id: product.id + "" }));
}
