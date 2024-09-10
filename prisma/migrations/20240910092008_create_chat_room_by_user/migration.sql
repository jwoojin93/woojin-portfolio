/*
  Warnings:

  - You are about to drop the `ChatRoomReadByUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChatRoomToChatRoomReadByUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatRoomReadByUser" DROP CONSTRAINT "ChatRoomReadByUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ChatRoomToChatRoomReadByUser" DROP CONSTRAINT "_ChatRoomToChatRoomReadByUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatRoomToChatRoomReadByUser" DROP CONSTRAINT "_ChatRoomToChatRoomReadByUser_B_fkey";

-- DropTable
DROP TABLE "ChatRoomReadByUser";

-- DropTable
DROP TABLE "_ChatRoomToChatRoomReadByUser";

-- CreateTable
CREATE TABLE "ChatRoomByUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "last_read_at" TIMESTAMP(3) NOT NULL,
    "chatRoomId" TEXT NOT NULL,

    CONSTRAINT "ChatRoomByUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatRoomByUser" ADD CONSTRAINT "ChatRoomByUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoomByUser" ADD CONSTRAINT "ChatRoomByUser_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
