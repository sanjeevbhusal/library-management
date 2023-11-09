import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "@/drizzle";
import { book, booking } from "@/drizzle/schema";
import { and, eq, isNull } from "drizzle-orm";
import { getServerSession } from "next-auth";

// This function returns all the currently rented books for a user. Currently Rented means user has not yet returned the book yet.
async function getActiveBookingsByUserId() {
  const session = await getServerSession(authOptions);
  return await db
    .select()
    .from(booking)
    .where(
      and(
        eq(booking.userId, session?.user.id as string),
        isNull(booking.returnedAt)
      )
    );
}

export default getActiveBookingsByUserId;
