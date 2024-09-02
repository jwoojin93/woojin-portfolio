import ThreeCanvas from "@/components/three/ThreeCanvas";
import Title from "@/components/title";
import Link from "next/link";
import { Suspense } from "react";

export default function Intro() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-5">
      <Title value="Woojin's Portfolio" />
      <div className="my-auto flex flex-col items-center gap-2">
        <Suspense fallback={null}>
          <div style={{ width: "100%", height: "50dvh" }}>
            <ThreeCanvas name="smile-emoji" />
          </div>
        </Suspense>
        {/* <h2 className="text-2xl text-center">{"어서오세요!"}</h2> */}
        <p className=" text-center">{"emoji 를 클릭해보세요!👆"}</p>
        <p>{"✔ JUST SUPRING IT ✔"}</p>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
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
