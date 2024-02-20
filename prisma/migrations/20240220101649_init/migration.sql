-- CreateTable
CREATE TABLE "Chatroom" (
    "crid" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chatroom_pkey" PRIMARY KEY ("crid")
);

-- CreateTable
CREATE TABLE "ChatroomUser" (
    "cuid" SERIAL NOT NULL,
    "crid" INTEGER NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatroomUser_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "Chat" (
    "cid" SERIAL NOT NULL,
    "crid" INTEGER NOT NULL,
    "cuid" INTEGER NOT NULL,
    "uuid" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("cid")
);

-- AddForeignKey
ALTER TABLE "ChatroomUser" ADD CONSTRAINT "ChatroomUser_crid_fkey" FOREIGN KEY ("crid") REFERENCES "Chatroom"("crid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomUser" ADD CONSTRAINT "ChatroomUser_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_crid_fkey" FOREIGN KEY ("crid") REFERENCES "Chatroom"("crid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_cuid_fkey" FOREIGN KEY ("cuid") REFERENCES "ChatroomUser"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
