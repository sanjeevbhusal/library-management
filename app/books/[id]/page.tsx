import React from "react";
import fetchBook from "@/actions/fetchBook";
import getActiveBookingsByBookId from "@/actions/getActiveBookingsByBookId";
import getActiveBookingsByUserId from "@/actions/getActiveBookingsByUserId";
import BookItem from "@/components/BookItem";
import getUserBookReview from "@/actions/getBookReviewByUserId";
import getBookReviews from "@/actions/bookReviews";
import getWeeklyBookRanking from "@/actions/getWeeklyBookRanking";

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const book = await fetchBook(params.id);
  const activeBookBookings = await getActiveBookingsByBookId(params.id);
  const activeUserBookings = await getActiveBookingsByUserId();
  const userBookReview = await getUserBookReview(params.id);
  const bookReviews = await getBookReviews(params.id);
  const weeklyBookRanking = await getWeeklyBookRanking(params.id);

  return (
    <main className="flex min-h-screen px-4 pb-4 mt-14 lg:py-8 lg:px-16 lg:mt-16 max-w-6xl mx-auto">
      {!book && (
        <div className="grow flex items-center justify-center">
          <h1>This book doesnot exist</h1>
        </div>
      )}
      {book && (
        <BookItem
          book={book}
          activeBookBookings={activeBookBookings}
          activeUserBookings={activeUserBookings}
          userBookReview={userBookReview}
          bookReviews={bookReviews.filter(
            (review) => review.id !== userBookReview?.id
          )}
          weeklyBookRanking={weeklyBookRanking}
          key={book.id}
        />
      )}
    </main>
  );
}
