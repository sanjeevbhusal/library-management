import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "@/drizzle";
import { review, user } from "@/drizzle/schema";
import { Review, User } from "@/drizzle/types";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

// This function returns a single review for a book done by a specific user the currently rented books for a user. Currently Rented means user has not yet returned the book yet.

export interface ReviewWithUser extends Review {
  user: User;
}

async function getBookReviews(bookId: string): Promise<ReviewWithUser[]> {
  const session = await getServerSession(authOptions);

  const response = await db
    .select()
    .from(review)
    .leftJoin(user, eq(review.userId, user.id))
    .where(eq(review.bookId, bookId));

  return response.map((reviewWithUser) => ({
    ...reviewWithUser.review,
    user: reviewWithUser.user as User,
  }));
}

export default getBookReviews;
