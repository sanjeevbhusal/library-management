CREATE TABLE IF NOT EXISTS "book" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"author" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "book_idx" ON "book" ("name");