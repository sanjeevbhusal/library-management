import { db } from "@/drizzle";
import { book, booking } from "@/drizzle/schema";
import { Book } from "@/drizzle/types";
import { and, eq, isNotNull, isNull, isSQLWrapper, ne } from "drizzle-orm";

export interface CurrentlyTakenBooksResult extends Book {
  bookedDate: Date;
  returnedDate: Date | null;
  dueDate: Date;
}

export interface ReturnedBooksResult extends Book {
  bookedDate: Date;
  returnedDate: Date | null;
  dueDate: Date;
}

async function fetchUserBooks(
  userId: string,
  currentlyTaken: boolean
): Promise<CurrentlyTakenBooksResult[]> {
  let bookings;

  if (currentlyTaken) {
    bookings = await db
      .select()
      .from(book)
      .fullJoin(booking, eq(book.id, booking.bookId))
      .where(and(eq(booking.userId, userId), isNull(booking.returnedAt)));
  } else {
    bookings = await db
      .select()
      .from(book)
      .fullJoin(booking, eq(book.id, booking.bookId))
      .where(and(eq(booking.userId, userId), isNotNull(booking.returnedAt)));
  }

  return bookings.map(({ booking, book }) => ({
    ...(book as Book),
    bookedDate: booking?.createdAt as Date,
    returnedDate: booking?.returnedAt as Date | null,
    dueDate: booking?.dueDate as Date,
  }));
}

export default fetchUserBooks;
