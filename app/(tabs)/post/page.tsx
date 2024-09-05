import ArrowButton from "@/components/arrow-button";
import ListPost from "@/components/list-post";
import Title from "@/components/title";
import db from "@/lib/db";
import getSession from "@/lib/session";

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

export const metadata = { title: "동네생활" };

export default async function Post() {
  const posts = await getPosts();
  const session = await getSession();
  console.log("session: ", session);
  return (
    <div className="flex flex-col">
      <Title value="Viewing the property" className="pb-8" />
      <p className="text-center text-neutral-600 mb-10 whitespace-normal break-keep">
        부동산 임장 보고서를 작성할 수 있는 게시판 입니다
        <br />
        자유롭게 게시글을 작성해주세요.
      </p>
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
      <Link href="/posts/add" className="primary-btn ">
        게시글 추가하기
      </Link>
    </div>
  );
}
