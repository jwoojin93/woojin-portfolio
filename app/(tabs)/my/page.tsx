import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: { id: session.id },
    });
    if (user) return user;
  }
  notFound();
}

async function Username() {
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  const user = await getUser();
  return <h1 className="mb-5 mt-5">Welcome! {user?.username}!</h1>;
}

export default async function MyPage() {
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div>
      <h1 className="text-7xl text-center mt-5 mb-10 font-rubick text-gray-900 font-extrabold">
        My Profile
      </h1>
      <Suspense fallback={"Welcome!"}>
        <Username />
      </Suspense>
      <form action={logOut}>
        <button className="primary-btn p-3">Log out</button>
      </form>
    </div>
  );
}
