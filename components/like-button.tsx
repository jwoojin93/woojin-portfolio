"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
  className?: string;
  isPreventEvent?: boolean;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
  className,
  isPreventEvent,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );

  const onClick = async (e: React.MouseEvent) => {
    if (isPreventEvent) e.preventDefault();
    reducerFn(undefined);
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${className} ${
        state.isLiked
          ? "text-orange-700 border-orange-700"
          : "text-neutral-700 border-neutral-700"
      }`}
    >
      {state.isLiked ? <HandThumbUpIcon /> : <OutlineHandThumbUpIcon />}
      {/* <OutlineHandThumbUpIcon /> */}
      <span> {state.likeCount}</span>
    </button>
  );
}
