-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "thumbnailUrl" TEXT,
ALTER COLUMN "content" DROP NOT NULL;
