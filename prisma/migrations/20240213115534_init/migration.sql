/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UserProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `birthdate` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserProfile` table. All the data in the column will be lost.
  - Added the required column `birthdate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthyear` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kakaoUID` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `login_type` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "password",
DROP COLUMN "username",
ADD COLUMN     "birthdate" INTEGER NOT NULL,
ADD COLUMN     "birthyear" INTEGER NOT NULL,
ADD COLUMN     "gender" INTEGER NOT NULL,
ADD COLUMN     "kakaoUID" BIGINT NOT NULL,
ADD COLUMN     "login_type" INTEGER NOT NULL,
ADD COLUMN     "uid" SERIAL NOT NULL,
ALTER COLUMN "premiere_user" SET DEFAULT false,
ALTER COLUMN "admin" SET DEFAULT false,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_pkey",
DROP COLUMN "birthdate",
DROP COLUMN "id",
DROP COLUMN "sex",
DROP COLUMN "userId",
ADD COLUMN     "pid" SERIAL NOT NULL,
ADD COLUMN     "uid" INTEGER NOT NULL,
ALTER COLUMN "alcohol" SET DATA TYPE DECIMAL(65,30),
ADD CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("pid");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
