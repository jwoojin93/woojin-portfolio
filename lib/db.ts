import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export default db;

async function test() {
  const user = await db.user.findMany({
    where: {
      username: {
        contains: "est",
      },
    },
  });
  console.log(user);
}

test();
