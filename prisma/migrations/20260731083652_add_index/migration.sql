-- CreateIndex
CREATE INDEX "bookmarks_user_id_created_at_idx" ON "bookmarks"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "books_author_id_idx" ON "books"("author_id");

-- CreateIndex
CREATE INDEX "books_status_idx" ON "books"("status");

-- CreateIndex
CREATE INDEX "books_is_published_idx" ON "books"("is_published");

-- CreateIndex
CREATE INDEX "books_is_published_status_idx" ON "books"("is_published", "status");

-- CreateIndex
CREATE INDEX "books_is_published_created_at_idx" ON "books"("is_published", "created_at");

-- CreateIndex
CREATE INDEX "chapters_book_id_idx" ON "chapters"("book_id");

-- CreateIndex
CREATE INDEX "chapters_book_id_chapter_number_idx" ON "chapters"("book_id", "chapter_number");

-- CreateIndex
CREATE INDEX "chapters_book_id_is_published_chapter_number_idx" ON "chapters"("book_id", "is_published", "chapter_number");

-- CreateIndex
CREATE INDEX "follows_book_id_idx" ON "follows"("book_id");

-- CreateIndex
CREATE INDEX "follows_user_id_idx" ON "follows"("user_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "reading_progess_user_id_updated_at_idx" ON "reading_progess"("user_id", "updated_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");
