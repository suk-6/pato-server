/*
  Warnings:

  - Added the required column `image` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `smoke` on the `UserProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "image" TEXT NOT NULL,
DROP COLUMN "smoke",
ADD COLUMN     "smoke" BOOLEAN NOT NULL;
