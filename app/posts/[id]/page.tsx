import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import LikeButton from "@/components/like-button";
import { IronSession } from "iron-session";
import BackButton from "@/components/back-button";
import Header from "@/components/header";
import Link from "next/link";

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
 * post-like-status 라는 key 를 사용하여 cache 를 저장합니다.
 * lite-status-[postId] 라는 tag 를 정의하여 cache 를 초기화 할 수 있도록 합니다.
 * @param postId
 * @returns
 */
async function getCachedLikeStatus(postId: number) {
  const session = await getSession();

  const cachedOperation = nextCache(
    () => getLikeStatus(postId, session),
    ["post-like-status"],
    {
      tags: [`like-status-${postId}`],
    }
  );
  return cachedOperation();
}

/**
 * post 를 생산한 유저가 현재 접속한 유저와 일치하는 지 확인.
 * @param userId
 * @returns
 */
async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) return session.id === userId;
  return false;
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

  // 현재 post 가 접속한 유저의 post 인지 확인.
  const isOwner = await getIsOwner(post.userId);

  /**
   * 채팅방 만들기
   * 1. 제품의 유저 아이디와, 현재 접속중인 유저 아이디를 조합하여 채팅방 id 를 만든다.
   * 2. 채팅방이 만들어지면 해당 채팅방으로 이동한다.
   */
  const createChatRoom = async () => {
    "use server";

    const session = await getSession(); // 세션 가져오기

    // post 의 user id 와 접속중인 user id 를 이용하여 chatRoom 데이터베이스 컬럼을 생성합니다.
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [{ id: post.userId }, { id: session.id }],
        },
      },
      select: { id: true },
    });

    // chatRoom 데이터베이스 컬럼이 생성되면 id 를 이용하여 채팅방으로 이동합니다.
    redirect(`/chats/${room.id}`);
  };

  /**
   * 게시글을 삭제하고 게시글 탭으로 이동합니다.
   */
  const deletePost = async () => {
    "use server";
    await db.post.delete({
      where: { id: post.id },
      select: { id: true },
    });
    redirect(`/post`);
  };

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

        <p className="mt-5 mb-5 break-all whitespace-normal">
          {post.description}
        </p>

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

        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />

        {isOwner ? (
          <div className="flex mt-10 gap-3">
            <Link href={`/posts/${post.id}/edit`} className="w-auto flex-1">
              <button className="primary-btn">EDIT</button>
            </Link>
            <form action={deletePost} className="w-auto flex-1">
              <button className="primary-btn">DELETE</button>
            </form>
          </div>
        ) : (
          <form action={createChatRoom}>
            <button className="primary-btn mt-16">채팅하기</button>
          </form>
        )}
      </div>
    </>
  );
}
