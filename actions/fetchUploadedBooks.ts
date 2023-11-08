import { db } from "@/drizzle";
import { book, booking, user } from "@/drizzle/schema";
import { Book, User } from "@/drizzle/types";
import { and, eq, isNotNull, isNull, isSQLWrapper, ne } from "drizzle-orm";

export interface UploadedBooksResult extends Book {
  uploadedUser: User;
}

async function fetchUploadedBooks(): Promise<UploadedBooksResult[]> {
  const books = await db
    .select()
    .from(book)
    .leftJoin(user, eq(user.id, book.uploadedBy));

  return books.map(({ book, user }) => ({
    ...(book as Book),
    uploadedUser: user as User,
  }));
}

export default fetchUploadedBooks;
