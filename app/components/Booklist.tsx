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
    <div className="flex flex-wrap gap-8 mt-8">
      {books.map((book) => {
        return <BookItem book={book} key={book.id} />;
      })}
    </div>
  );
}

export default BookList;
