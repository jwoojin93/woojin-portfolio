import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Text } from "@chakra-ui/react";
import LikeButton from "./like-button";
import { getLikeStatus } from "@/app/posts/[id]/actions";
import getSession from "@/lib/session";

interface ListPostProps {
  title: string;
  description?: String | null;
  created_at: Date;
  photo: string | null;
  id: number;
  views: number;
  _count: {
    likes: number;
    comments: number;
  };
  user: {
    id: number;
    avatar: String | null;
    username: String;
  };

  sessionId: number;
}

export default async function ListPost({
  title,
  description,
  created_at,
  photo,
  id,
  views,
  _count,
  user,
  sessionId,
}: ListPostProps) {
  const session = await getSession();
  const { likeCount, isLiked } = await getLikeStatus(id, session.id!);

  return (
    <Link
      href={`/posts/${id}`}
      className={`mb-5 shadow-md rounded-md p-5 bg-white text-neutral-400 flex flex-col gap-2 last:pb-0 last:border-b-0 `}
    >
      <div className="flex gap-4">
        <div className="relative min-w-28 min-h-28 rounded-md overflow-hidden">
          <Image
            fill
            src={photo ? `${photo}/avatar` : `/placeholder.jpg`}
            className="object-cover"
            alt={title}
          />
        </div>
        <div className="flex-1 flex flex-col gap-1 *:text-black">
          <Text
            as="h3"
            className="text-lg text-orange-900 font-semibold max-w-[150px] sm:max-w-[400px] md:max-w-[500px]"
            noOfLines={1}
          >
            {title}
          </Text>
          {description && (
            <Text
              className="text-sm text-orange-900 max-w-[150px] sm:max-w-[400px] md:max-w-[500px]"
              noOfLines={1}
            >
              {description}
            </Text>
          )}

          <div className="flex-1"></div>

          <div className=" flex gap-2 justify-between items-center flex-wrap">
            <div className="flex-1 flex items-center gap-2 justify-start">
              <div className="relative size-5 sm:size-8 rounded-md overflow-hidden">
                <Image
                  fill
                  src={user.avatar ? String(user.avatar) : `/placeholder.jpg`}
                  className="object-cover rounded-full"
                  alt={title}
                />
              </div>
              <p className={`${sessionId === user.id ? "bg-orange-200" : ""}`}>
                {user.username}
              </p>
            </div>

            <div className="flex gap-4 flex-wrap  ">
              {/* 좋아요 */}
              <LikeButton
                isLiked={isLiked}
                likeCount={likeCount}
                postId={id}
                className="flex gap-1 items-center text-sm [&>svg]:size-4"
                isPreventEvent={true}
              />

              {/* 댓글: 추후 댓글 기능 작업시 주석해제 */}
              {/* <span className="flex gap-1 items-center text-sm">
                <ChatBubbleBottomCenterIcon className="size-4" />
                {_count.comments}
              </span> */}

              {/* 조회수 */}
              <span className="flex gap-1 items-center text-sm">
                <EyeIcon className="size-4" />
                {views}
              </span>
              <span className="text-sm text-neutral-500 hidden sm:block">
                {formatToTimeAgo(created_at.toString())}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
