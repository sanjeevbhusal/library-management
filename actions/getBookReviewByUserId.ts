import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "@/drizzle";
import { book, booking, review } from "@/drizzle/schema";
import { Review } from "@/drizzle/types";
import { and, eq, isNull } from "drizzle-orm";
import { getServerSession } from "next-auth";

// This function returns a single review for a book done by a specific user the currently rented books for a user. Currently Rented means user has not yet returned the book yet.
async function getUserBookReview(bookId: string) {
  const session = await getServerSession(authOptions);

  const response = await db
    .select()
    .from(review)
    .where(
      and(
        eq(review.userId, session?.user.id as string),
        eq(review.bookId, bookId)
      )
    );

  return response[0] ? response[0] : null;
}

export default getUserBookReview;
