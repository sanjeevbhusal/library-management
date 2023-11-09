import { db } from "@/drizzle";
import { book, booking } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

// This function returns all the active bookings for a book. Active bookings means user has not yet returned the book yet.
async function getActiveBookingsByBookId(bookId: string) {
  return await db.select().from(booking).where(eq(booking.bookId, bookId));
}

export default getActiveBookingsByBookId;
