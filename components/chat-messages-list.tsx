"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { saveMessage } from "@/app/chats/actions";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * supabase 변수 입니다.
 * public key 와 url 은 client 단에서 사용하며 중요한 key 가 아니기 때문에 env 에 설정하지 않았습니다.
 */
const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtbXlzaXRsc2dzZWVsZWFmaXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ1NzM0MjMsImV4cCI6MjA0MDE0OTQyM30.ouM3hT54Pi4K7uR2oErs4P5_uQy63dsDwSsbV6MNgMA";
const SUPABASE_URL = "https://lmmysitlsgseeleafiwy.supabase.co";

interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string | null;
}

// 채팅메시지 리스트 컴포넌트 입니다.
export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages); // 그동안 주고받은 메시지
  const [message, setMessage] = useState(""); // 입력하는 메시지
  const channel = useRef<RealtimeChannel>(); // supabase 의 실시간 채널, supabase 가 맞나? cloudflare 인가?
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  /**
   * message 입력 이벤트 입니다.
   * message 상태를 정의합니다.
   * @param event
   */
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };

  /**
   * 제출하기 이벤트 입니다
   * @param event
   */
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    /**
     * 주고받은 메시지 상태에 현재 입력한 메시지를 추가합니다.
     */
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: "string",
          avatar: null,
        },
      },
    ]);

    // 실시간 채널에 메시지 이벤트 데이터를 발송합니다.
    // id, 메세지, 생성시간, 유저 아이디, 유저가 포함됩니다.
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username,
          avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
  };

  useEffect(() => {
    // supabase client 를 생성합니다.
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

    // client.channel 의 기능은? 채널을 생성한다는 건 웹소켓 채널이 생긴다는 건가? 유저간에 채팅방?
    channel.current = client.channel(`room-${chatRoomId}`);

    // broadcast 이벤트란?
    // 받은 payload(메시지 포맷) 으로 주고받은 메시지들 상태를 재정의 합니다.
    // broadcast 이벤트를 구독합니다.
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
      })
      .subscribe();

    // 컴포넌트가 종료될 때 supabase client 채널 구독을 취소합니다.
    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-full pb-14">
      <div className="flex flex-col justify-start gap-5 w-full max-h-[-webkit-fill-available] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 items-start ${
              message.userId === userId ? "justify-end" : ""
            }`}
          >
            {message.userId === userId ? null : (
              <Image
                src={
                  message.user.avatar ? message.user.avatar : "/placeholder.jpg"
                }
                alt={message.user.username}
                width={50}
                height={50}
                className="size-8 rounded-full"
              />
            )}
            <div
              className={`flex flex-col gap-1 ${
                message.userId === userId ? "items-end" : ""
              }`}
            >
              <span
                className={`text-neutral-100 ${
                  message.userId === userId ? "bg-orange-500" : "bg-neutral-500"
                } p-2.5 rounded-xl`}
              >
                {message.payload}
              </span>
              <span className="text-xs">
                {formatToTimeAgo(message.created_at.toString())}
              </span>
            </div>
          </div>
        ))}

        <div ref={messageEndRef}></div>
        <form
          className="fixed bottom-5 max-w-[760px] w-[calc(100%-40px)]"
          onSubmit={onSubmit}
        >
          <input
            required
            onChange={onChange}
            value={message}
            className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
            type="text"
            name="message"
            placeholder="Write a message..."
          />
          <button className="absolute right-0">
            <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
          </button>
        </form>
      </div>
    </div>
  );
}
