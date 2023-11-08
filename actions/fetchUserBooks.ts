import { db } from "@/drizzle";
import { book, booking } from "@/drizzle/schema";
import { Book } from "@/drizzle/types";
import { and, eq, isNotNull, isNull, isSQLWrapper, ne } from "drizzle-orm";

async function fetchUserBooks(userId: string, currentlyTaken: boolean) {
  // returned at is a date.
  // if user wants to view currentlyTaken books, then returnedAt is null
  let bookings;

  if (currentlyTaken) {
    bookings = await db
      .select()
      .from(booking)
      .fullJoin(book, eq(book.id, booking.bookId))
      .where(and(eq(booking.userId, userId), isNull(booking.returnedAt)));
  } else {
    bookings = await db
      .select()
      .from(booking)
      .fullJoin(book, eq(book.id, booking.bookId))
      .where(and(eq(booking.userId, userId), isNotNull(booking.returnedAt)));
  }

  return bookings.map((booking) => booking.book as Book);
}

export default fetchUserBooks;
