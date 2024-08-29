import ListPost from "@/components/list-post";
import db from "@/lib/db";

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
    },
  });
  return posts;
}

export const metadata = { title: "동네생활" };

export default async function Post() {
  const posts = await getPosts();
  return (
    <div className="p-5 flex flex-col">
      {posts.length > 0 ? (
        posts.map((post) => <ListPost key={post.id} {...post} />)
      ) : (
        <div className="min-h-[100px] flex justify-center items-center flex-col">
          <span>게시글이 없습니다.</span>
          <span>게시글을 추가해주세요</span>
        </div>
      )}
      <Link
        href="/posts/add"
        className="primary-btn flex items-center justify-center rounded-md p-3"
      >
        게시글 추가하기
      </Link>
    </div>
  );
}
