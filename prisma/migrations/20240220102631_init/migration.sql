/*
  Warnings:

  - Added the required column `chatToken` to the `ChatroomUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatroomUser" ADD COLUMN     "chatToken" TEXT NOT NULL;
