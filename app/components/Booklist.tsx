import { db } from "@/drizzle";
import BookItem from "./BookItem";
import { book, user } from "@/drizzle/schema";
import fetchBooks from "@/actions/fetchBooks";

interface Props {
  searchTerm: string | undefined;
  category: string | undefined;
}

async function BookList({ searchTerm, category }: Props) {
  const books = await fetchBooks({
    searchTerm: searchTerm || "",
    category: category || "",
  });

  return (
    <div>
      {books.length === 0 ? (
        <div className="flex items-center justify-center flex-col gap-2 mt-12">
          <h1>No books match your filter</h1>
          <p className="text-sm text-gray-500">
            Select some other filters or remove filters completely
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {books.map((book) => {
            return (
              <div
                className="flex flex-col basis-[calc(50%-12px)] md:basis-[calc(33.3%-16px)] lg:basis-[calc(25%-18px)] xl:basis-[calc(20%-19.2px)] 2xl:basis-[calc(16.6%-20px)]"
                key={book.id}
              >
                <BookItem book={book} key={book.id} />;
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BookList;
