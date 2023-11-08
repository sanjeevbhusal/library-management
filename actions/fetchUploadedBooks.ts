import { db } from "@/drizzle";
import { book, booking, user } from "@/drizzle/schema";
import { Book } from "@/drizzle/types";
import { and, eq, isNotNull, isNull, isSQLWrapper, ne } from "drizzle-orm";

async function fetchUploadedBooks(userId: string) {
  const books = await db
    .select()
    .from(book)
    .fullJoin(user, eq(user.id, book.uploadedBy))
    .where(eq(book.uploadedBy, userId));
  return books.map(({ book, user }) => ({ ...book, uploadedUser: user }));
}

export default fetchUploadedBooks;
