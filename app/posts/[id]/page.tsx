import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";
import { IronSession } from "iron-session";

/**
 * post id 를 이용하여 post 를 가져옵니다.
 * @param id
 * @returns post
 */
async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

/**
 * 게시글을 가져올 때 next cache 를 사용합니다.
 * post-detail 이라는 key 를 사용하여 cache 를 저장합니다.
 * post-detail 이라는 tag 를 사용하여 cache 를 초기화 할 수 있도록 합니다.
 * 60초 마다 캐시를 초기화합니다.
 */
const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

interface SessionContent {
  id?: number;
}

/**
 * post id 를 이용하여 좋아요 상태를 가져옵니다.
 * @param postId
 * @returns
 */
async function getLikeStatus(
  postId: number,
  session: IronSession<SessionContent>
) {
  // post id 와 user id 를 사용하여 like 여부를 조회합니다.
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });

  // like database 의 수를 조회합니다.
  const likeCount = await db.like.count({
    where: { postId },
  });

  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

/**
 * 좋아요 가져오기를 할 때 next cache 를 사용합니다.
 * product-like-status 라는 key 를 사용하여 cache 를 저장합니다.
 * lite-status-[postId] 라는 tag 를 정의하여 cache 를 초기화 할 수 있도록 합니다.
 * @param postId
 * @returns
 */
async function getCachedLikeStatus(postId: number) {
  const session = await getSession();

  const cachedOperation = nextCache(
    () => getLikeStatus(postId, session),
    ["product-like-status"],
    {
      tags: [`like-status-${postId}`],
    }
  );
  return cachedOperation();
}

// 게시물 상세 페이지 입니다.
export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  // post id 가 없을 경우 not found 를 호출합니다.
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  // post 가 없을 경우 not found 를 호출합니다.
  const post = await getCachedPost(id);
  if (!post) return notFound();

  // 좋아요 수와, 좋아요 여부를 가져옵니다.
  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  return (
    <div className="p-5 ">
      <div className="flex items-center gap-2 mb-2">
        {/* <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.username}
        /> */}
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
      </div>
    </div>
  );
}
