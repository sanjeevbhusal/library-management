import { db } from "@/drizzle";
import { book, booking } from "@/drizzle/schema";
import { Book } from "@/drizzle/types";
import { and, eq, isNotNull, isNull, isSQLWrapper, ne } from "drizzle-orm";

async function fetchUploadedBooks(userId: string) {
  return await db.select().from(book).where(eq(book.uploadedBy, userId));
}

export default fetchUploadedBooks;
