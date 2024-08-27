import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

const getCachedProducts = nextCache(getInitialProducts, ["home-products"]);

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: "Home",
};

//export const dynamic = "force-dynamic";
// export const revalidate = 60;

export default async function Products() {
  const initialProducts = await getInitialProducts();
  const revalidate = async () => {
    "use server";
    revalidatePath("/home");
  };
  console.log("initialProducts: ", initialProducts);
  return (
    <div>
      {initialProducts.length > 0 ? (
        <ProductList initialProducts={initialProducts} />
      ) : (
        <div className="min-h-[100px] flex justify-center items-center flex-col">
          <span>게시글이 없습니다.</span>
          <span>게시글을 추가해주세요</span>
        </div>
      )}

      <Link
        href="/products/add"
        className="primary-btn flex items-center justify-center rounded-md p-3"
      >
        게시글 추가하기
      </Link>
    </div>
  );
}
