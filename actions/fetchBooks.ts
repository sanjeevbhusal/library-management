import { db } from "@/drizzle";
import { book } from "@/drizzle/schema";
import { and, ilike } from "drizzle-orm";

async function fetchBooks({
  searchTerm,
  category,
}: {
  searchTerm: string;
  category: string;
}) {
  return await db
    .select()
    .from(book)
    .where(
      and(
        ilike(book.name, `%${searchTerm}%`),
        ilike(book.category, `%${category}%`)
      )
    );
}

export default fetchBooks;
