import ArrowButton from "@/components/arrow-button";
import ListPost from "@/components/list-post";
import Title from "@/components/title";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      photo: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
      user: {
        select: {
          id: true,
          avatar: true,
          username: true,
        },
      },
    },
  });
  return posts;
}

export const metadata = { title: "POST LIST" };

export default async function Post() {
  const posts = await getPosts();
  const session = await getSession();

  return (
    <div className="flex flex-col">
      <Title value="Free bulletin board" className="pb-8" />
      <p className="text-center text-neutral-600 mb-10 whitespace-normal break-keep">
        자유게시판 입니다. <br />
        수정과 삭제가 가능하니 자유롭게 게시글을 작성해주세요.✍️
      </p>
      <div className="flex justify-end mb-5">
        <Link
          href="/posts/add"
          className="primary-btn w-auto flex gap-2 items-center"
        >
          <PencilSquareIcon className="size-5" />
          게시글 작성하기
        </Link>
      </div>

      {posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <ListPost key={post.id} sessionId={session.id!} {...post} />
          ))}
          <ArrowButton />
        </>
      ) : (
        <div className="min-h-[100px] flex justify-center items-center flex-col">
          <span>게시글이 없습니다.</span>
          <span>게시글을 추가해주세요</span>
        </div>
      )}
    </div>
  );
}
