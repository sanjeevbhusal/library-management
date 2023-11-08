import { db } from "@/drizzle";
import { book } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

async function fetchBook(bookId: string) {
  const b = await db.select().from(book).where(eq(book.id, bookId));
  return b.length === 0 ? null : b[0];
}

export default fetchBook;
