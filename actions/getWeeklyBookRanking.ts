import { db } from "@/drizzle";
import { book, booking } from "@/drizzle/schema";
import { and, ilike, sql } from "drizzle-orm";

async function getWeeklyBookRanking(bookId: string) {
  // const ranking = await db
  //   .select({
  //     id: booking.bookId,
  //     count: sql<number>`cast(count(${booking.bookId}) as int)`,
  //   })
  //   .from(booking)
  //   .groupBy(booking.bookId)
  //   .orderBy(booking.bookId);
  const ranking = await db
    .select({
      bookId: booking.bookId,
      // count: sql<number>`cast(count(${booking.bookId}) as int)`,
    })
    .from(booking)
    .groupBy(booking.bookId)
    .orderBy(sql`count(${booking.bookId}) DESC`);
  console.log(ranking);

  return ranking.indexOf({ bookId }) + 1;
}

export default getWeeklyBookRanking;
