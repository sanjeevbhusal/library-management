ALTER TABLE "book" ADD COLUMN "uploadedBy" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book" ADD CONSTRAINT "book_uploadedBy_user_id_fk" FOREIGN KEY ("uploadedBy") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
