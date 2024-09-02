import Title from "@/components/title";
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
      <Title value="My Profile" />
      <Suspense fallback={"Welcome!"}>
        <Username />
      </Suspense>
      <form action={logOut}>
        <button className="primary-btn">Log out</button>
      </form>
    </div>
  );
}
