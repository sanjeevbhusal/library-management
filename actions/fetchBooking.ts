import { db } from "@/drizzle";
import { book, booking } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

async function fetchBooking(bookId: string) {
  return await db.select().from(booking).where(eq(booking.bookId, bookId));
}

export default fetchBooking;
