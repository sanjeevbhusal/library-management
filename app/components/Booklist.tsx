import { db } from "@/drizzle";
import BookItem from "./BookItem";
import { book, user } from "@/drizzle/schema";
import { ilike } from "drizzle-orm";

async function fetchBooks(searchTerm: string) {
  return await db
    .select()
    .from(book)
    .where(ilike(book.name, `%${searchTerm}%`));
}

interface Props {
  searchTerm: string;
}

async function BookList({ searchTerm }: Props) {
  const books = await fetchBooks(searchTerm);

  return (
    <div className="flex flex-wrap gap-6 mt-8">
      {books.map((book) => {
        return (
          <div
            className="flex flex-col basis-[calc(50%-12px)] md:basis-[calc(33.3%-16px)] lg:basis-[calc(25%-18px)] xl:basis-[calc(20%-19.2px)] 2xl:basis-[calc(16.6%-20px)]"
            key={book.id}
          >
            <BookItem book={book} key={book.id} />;
          </div>
        );
        return;
      })}
    </div>
  );
}

export default BookList;
