import ThreeCanvas from "@/components/three/ThreeCanvas";
import Title from "@/components/title";
import Link from "next/link";
import { Suspense } from "react";

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
        <p className=" text-center">emoji 를 클릭해보세요!👆</p>
        <p className="mb-8">✔ JUST SUPRING IT ✔</p>
        <Link href="/create-account" className="primary-btn">
          시작하기
        </Link>
        <div className="flex gap-2">
          <span>이미 계정이 있나요?</span>
          <Link href="/login" className="hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
