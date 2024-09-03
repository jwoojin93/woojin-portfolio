import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Text } from "@chakra-ui/react";

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
}

export default function ListPost({
  title,
  description,
  created_at,
  photo,
  id,
  views,
  _count,
}: ListPostProps) {
  return (
    <Link
      href={`/posts/${id}`}
      className=" mb-5 shadow-md rounded-md p-5 bg-white text-neutral-400 flex flex-col gap-2 last:pb-0 last:border-b-0"
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
          <div className=" flex gap-4 justify-end items-center *:flex *:gap-1 *:items-center *:text-sm">
            <span>
              <HandThumbUpIcon className="size-4" />
              {_count.likes}
            </span>
            <span>
              <ChatBubbleBottomCenterIcon className="size-4" />
              {_count.comments}
            </span>
            <span>
              <EyeIcon className="size-4" />
              {views}
            </span>
            <span className="text-sm text-neutral-500">
              {formatToTimeAgo(created_at.toString())}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
