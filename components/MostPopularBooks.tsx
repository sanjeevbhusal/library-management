import BookItem from "@/app/components/BookItem";
import { Book } from "@/drizzle/types";
import { sql } from "@vercel/postgres";

async function getMostPopularBooks() {
  const response =
    await sql`SELECT b."bookId" as id, COUNT(b.id) AS booking_count,
       bk."name" AS name, bk."author" AS author, bk."category" AS category, bk."imageUrl" AS "imageUrl"
FROM "booking" b
INNER JOIN "book" bk ON b."bookId" = bk."id"
GROUP BY b."bookId", bk."name", bk."author", bk."category", bk."imageUrl"
ORDER BY booking_count DESC;

`;
  return response.rows as Book[];
}

async function MostPopularBooks() {
  const books = await getMostPopularBooks();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-medium text-base lg:text-2xl">Most Popular Books</h1>
      <div className="flex flex-wrap gap-6 mt-4">
        {books.length === 0 ? (
          <h1>There is no any popular book in the SecurityPal Library.</h1>
        ) : (
          books.map((book) => {
            return (
              <div
                className="flex flex-col basis-[calc(50%-12px)] md:basis-[calc(33.3%-16px)] lg:basis-[calc(25%-18px)] xl:basis-[calc(20%-19.2px)] 2xl:basis-[calc(16.6%-20px)]"
                key={book.id}
              >
                <BookItem book={book} key={book.id} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MostPopularBooks;
