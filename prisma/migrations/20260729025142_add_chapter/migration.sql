/*
  Warnings:

  - You are about to drop the `Chapter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_book_id_fkey";

-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "reading_progess" DROP CONSTRAINT "reading_progess_chapter_id_fkey";

-- DropTable
DROP TABLE "Chapter";

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "chapter_number" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "word_count" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "book_id" TEXT NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chapters_book_id_chapter_number_key" ON "chapters"("book_id", "chapter_number");

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_progess" ADD CONSTRAINT "reading_progess_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
