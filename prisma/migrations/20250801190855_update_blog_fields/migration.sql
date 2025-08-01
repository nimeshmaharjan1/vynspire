-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "category" TEXT,
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "readTime" TEXT,
ADD COLUMN     "tags" TEXT[];
