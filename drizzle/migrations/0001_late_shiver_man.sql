ALTER TABLE "review" ADD COLUMN "bookId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review" ADD CONSTRAINT "review_bookId_book_id_fk" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
