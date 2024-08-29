import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

interface ListPostProps {
  title: string;
  created_at: Date;
  photo: string | null;
  id: number;
  views: number;
  _count: {
    likes: number;
    comments: number;
  };
}

export default function ListPost({
  title,
  created_at,
  photo,
  id,
  views,
  _count,
}: ListPostProps) {
  return (
    <Link
      href={`/posts/${id}`}
      className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex flex-col gap-2 last:pb-0 last:border-b-0"
    >
      <div className="flex gap-4">
        <div className="relative size-28 rounded-md overflow-hidden">
          <Image
            width={112}
            height={112}
            src={photo ? `${photo}/avatar` : `/placeholder.jpg`}
            className="object-cover"
            alt={title}
          />
        </div>
        <div className="flex flex-col gap-1 *:text-black">
          <span className="text-lg">{title}</span>
          <span className="text-sm text-neutral-500">
            {formatToTimeAgo(created_at.toString())}
          </span>
        </div>
      </div>

      <div className="flex gap-4 items-center justify-end *:flex *:gap-1 *:items-center">
        <span>조회 {views}</span>
        <span>
          <HandThumbUpIcon className="size-4" />
          {_count.likes}
        </span>
        <span>
          <ChatBubbleBottomCenterIcon className="size-4" />
          {_count.comments}
        </span>
      </div>
    </Link>
  );
}
