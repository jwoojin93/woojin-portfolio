import SocialLogin from "@/components/social-login";
import ThreeCanvas from "@/components/three/ThreeCanvas";
import Title from "@/components/title";
import Link from "next/link";
import { Suspense } from "react";
import TestLogin from "./test-login";

export default function Intro() {
  return (
    <div className="flex flex-col h-full">
      <Title value="Woojin's Portfolio" />
      <div className="my-auto flex flex-col items-center gap-2 flex-1">
        <Suspense fallback={null}>
          <ThreeCanvas name="smile-emoji" />
        </Suspense>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <p className="w-full text-center animate-bounce">
          👆 3D 이모티콘을 클릭해보세요! 👆
        </p>
        <p className="mb-8 animate-bounce">
          ✔ <span className="font-rubick font-bold">JUST SURFING IT</span> ✔
        </p>

        <div className="flex gap-2">
          <span>SNS 계정이 없다면?</span>
          <Link href="/login" className="hover:underline">
            로그인
          </Link>
          /
          <Link href="/create-account" className="hover:underline">
            회원가입
          </Link>
        </div>
        <TestLogin />
        <SocialLogin />
      </div>
    </div>
  );
}
