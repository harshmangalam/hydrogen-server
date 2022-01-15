/*
  Warnings:

  - Added the required column `authorId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostAudienceEnum" AS ENUM ('PUBLIC', 'FRIENDS', 'ONLY_ME', 'SPECIFIC');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "audience" "PostAudienceEnum" NOT NULL DEFAULT E'PUBLIC',
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "checkIn" TEXT,
ADD COLUMN     "feeling" TEXT,
ADD COLUMN     "gif" TEXT,
ADD COLUMN     "media" TEXT[],
ALTER COLUMN "content" DROP NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "coverImage" TEXT,
    "profileImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__UsersPostsTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "__UsersPostsSpecificAudience" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "__UsersPostsTag_AB_unique" ON "__UsersPostsTag"("A", "B");

-- CreateIndex
CREATE INDEX "__UsersPostsTag_B_index" ON "__UsersPostsTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "__UsersPostsSpecificAudience_AB_unique" ON "__UsersPostsSpecificAudience"("A", "B");

-- CreateIndex
CREATE INDEX "__UsersPostsSpecificAudience_B_index" ON "__UsersPostsSpecificAudience"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__UsersPostsTag" ADD FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__UsersPostsTag" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__UsersPostsSpecificAudience" ADD FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__UsersPostsSpecificAudience" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
