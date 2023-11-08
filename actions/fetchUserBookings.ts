import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "@/drizzle";
import { book, booking } from "@/drizzle/schema";
import { and, eq, isNull } from "drizzle-orm";
import { getServerSession } from "next-auth";

async function fetchUserBooking() {
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

export default fetchUserBooking;
