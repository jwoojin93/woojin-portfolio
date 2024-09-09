import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";
import BackButton from "@/components/back-button";
import Header from "@/components/header";
import Link from "next/link";
import Textarea from "@/components/textarea";
import ArrowButton from "@/components/arrow-button";
import {
  createChatRoom,
  deletePost,
  getCachedLikeStatus,
  getIsOwner,
  getPost,
} from "./actions";

// 게시물 상세 페이지 입니다.
export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  if (isNaN(id)) return notFound(); // post id 가 없을 경우 not found 를 호출합니다.
  const post = await getPost(id); // const post = await getCachedPost(id);
  if (!post) return notFound(); // post 가 없을 경우 not found 를 호출합니다.
  const { likeCount, isLiked } = await getCachedLikeStatus(id); // 좋아요 수와, 좋아요 여부를 가져옵니다.
  const isOwner = await getIsOwner(post.userId); // 현재 post 가 접속한 유저의 post 인지 확인.

  return (
    <>
      <Header>
        <BackButton />
      </Header>

      <div className="mt-14">
        {post.photo && (
          <div className="aspect-video relative mb-7">
            <Image
              className="object-contain shadow-sm rounded-lg w-full h-full"
              fill
              src={`${post.photo}/public`}
              alt={post.title}
            />
          </div>
        )}

        <h2 className="ext-lg font-semibold break-all whitespace-normal">
          {post.title}
        </h2>

        <Textarea name="description" readOnly className="p-0 text-sm mt-3">
          {post.description}
        </Textarea>

        <div className="flex justify-between items-center gap-2 text-neutral-400 text-sm mb-5">
          <div className="flex items-center gap-5">
            <Image
              width={40}
              height={40}
              className="size-10 rounded-full"
              src={post.user.avatar ? post.user.avatar : "/placeholder.jpg"}
              alt={post.user.username}
            />
            <div>
              <span className="text-sm font-semibold">
                {post.user.username}
              </span>
              <div className="text-xs">
                <span>{formatToTimeAgo(post.created_at.toString())}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <EyeIcon className="size-5" />
            <span>조회 {post.views}</span>
          </div>
        </div>

        <LikeButton
          isLiked={isLiked}
          likeCount={likeCount}
          postId={id}
          className="flex w-full justify-center items-center gap-2 text-sm border rounded-full p-2 transition-colors bg-transparent  [&>svg]:size-5"
        />

        {isOwner ? (
          <div className="flex mt-10 gap-3">
            <Link href={`/posts/${post.id}/edit`} className="w-auto flex-1">
              <button className="primary-btn">EDIT</button>
            </Link>
            <form action={() => deletePost(post)} className="w-auto flex-1">
              <button className="primary-btn">DELETE</button>
            </form>
          </div>
        ) : (
          <form action={() => createChatRoom(post)}>
            <button className="primary-btn mt-16">채팅하기</button>
          </form>
        )}
      </div>

      <ArrowButton bottom={"bottom-5"} />
    </>
  );
}
