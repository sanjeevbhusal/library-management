import BookItem from "@/app/components/BookItem";
import { db } from "@/drizzle";
import { book, booking, user } from "@/drizzle/schema";
import { Book, Booking } from "@/drizzle/types";
import { sql } from "@vercel/postgres";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

type BookWithBookedTime = Book & { bookedAt: Date };

async function getYourBooks(): Promise<BookWithBookedTime[]> {
  const session = await getServerSession();
  const u = await db
    .select()
    .from(user)
    .where(eq(user.email, session?.user?.email as string));

  const books = await db
    .select()
    .from(booking)
    .where(eq(booking.userId, u[0].id))
    .fullJoin(book, eq(book.id, booking.bookId));

  return books.map((book) => ({
    ...(book.book as Book),
    bookedAt: book.booking?.createdAt as Date,
  }));
}

async function YourBooks() {
  const books = await getYourBooks();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-medium text-base lg:text-2xl">Your Books</h1>
      <div className="flex flex-wrap gap-8 mt-4">
        {books.map((book) => {
          return (
            <BookItem book={book} key={book.id} bookedAt={book.bookedAt} />
          );
        })}
      </div>
    </div>
  );
}

export default YourBooks;
