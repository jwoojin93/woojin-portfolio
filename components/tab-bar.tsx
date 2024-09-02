"use client";

import {
  HomeIcon as SolidHomeIcon,
  NewspaperIcon as SolidNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
  VideoCameraIcon as SolidVideoCameraIcon,
  UserIcon as SolidUserIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
  VideoCameraIcon as OutlineVideoCameraIcon,
  UserIcon as OutlineUserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Url } from "next/dist/shared/lib/router/router";

const TabBtn = ({
  children,
  href,
}: {
  children?: React.ReactNode;
  href: Url;
}) => {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-px flex-1 py-4 [&>svg]:w-7 [&>svg]:h-7"
    >
      {children}
    </Link>
  );
};

export default function TabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 bottom-0 w-full border-orange-950 border-t  *:text-orange-950 bg-neutral-100 flex ">
      <TabBtn href="/intro">
        {pathname === "/intro" ? <SolidHomeIcon /> : <OutlineHomeIcon />}
        <span>Intro</span>
      </TabBtn>

      <TabBtn href="/readme">
        {pathname === "/readme" ? (
          <SolidNewspaperIcon />
        ) : (
          <OutlineNewspaperIcon />
        )}
        <span>Readme</span>
      </TabBtn>

      <TabBtn href="/post">
        {pathname === "/post" ? (
          <SolidNewspaperIcon />
        ) : (
          <OutlineNewspaperIcon />
        )}
        <span>Post</span>
      </TabBtn>

      <TabBtn href="/chat">
        {pathname === "/chat" ? <SolidChatIcon /> : <OutlineChatIcon />}
        <span>Chat</span>
      </TabBtn>

      {/* <TabBtn href="/stream">
        {pathname === "/stream" ? (
          <SolidVideoCameraIcon />
        ) : (
          <OutlineVideoCameraIcon />
        )}
        <span>Stream</span>
      </TabBtn> */}

      <TabBtn href="/my">
        {pathname === "/my" ? <SolidUserIcon /> : <OutlineUserIcon />}
        <span>My</span>
      </TabBtn>
    </div>
  );
}
