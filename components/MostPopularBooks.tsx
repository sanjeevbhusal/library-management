import BookItem from "@/app/components/BookItem";
import { Book } from "@/drizzle/types";
import { sql } from "@vercel/postgres";

async function getMostPopularBooks() {
  const response = await sql`SELECT b."bookId", COUNT(b.id) AS booking_count,
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
      <div className="flex flex-wrap gap-8 mt-4">
        {books.map((book) => {
          return <BookItem book={book} key={book.id} />;
        })}
      </div>
    </div>
  );
}

export default MostPopularBooks;
