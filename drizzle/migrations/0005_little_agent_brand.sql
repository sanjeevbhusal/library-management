ALTER TABLE "booking" ALTER COLUMN "createdAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "dueDate" timestamp;--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "returnedAt" timestamp;