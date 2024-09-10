-- CreateTable
CREATE TABLE "ChatRoomReadByUser" (
    "id" SERIAL NOT NULL,
    "last_read_at" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "chatRoomId" INTEGER NOT NULL,

    CONSTRAINT "ChatRoomReadByUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatRoomToChatRoomReadByUser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChatRoomToChatRoomReadByUser_AB_unique" ON "_ChatRoomToChatRoomReadByUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatRoomToChatRoomReadByUser_B_index" ON "_ChatRoomToChatRoomReadByUser"("B");

-- AddForeignKey
ALTER TABLE "ChatRoomReadByUser" ADD CONSTRAINT "ChatRoomReadByUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomToChatRoomReadByUser" ADD CONSTRAINT "_ChatRoomToChatRoomReadByUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomToChatRoomReadByUser" ADD CONSTRAINT "_ChatRoomToChatRoomReadByUser_B_fkey" FOREIGN KEY ("B") REFERENCES "ChatRoomReadByUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
