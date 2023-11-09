import { db } from "@/drizzle";
import { book as bookSchema, booking } from "@/drizzle/schema";
import { and, eq, isNull } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import authOptions from "../auth/[...nextauth]/authOptions";

const schema = z.object({
  bookId: z.string(),
  dueDate: z.string().datetime(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let dto: any;

  try {
    dto = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "JSON Body is not present" },
      { status: 400 }
    );
  }

  const parsedDto = schema.safeParse(dto);
  if (!parsedDto.success) {
    return NextResponse.json({ error: parsedDto.error }, { status: 400 });
  }
  const { bookId, dueDate } = parsedDto.data;

  const fetchBookResponse = await db
    .select()
    .from(bookSchema)
    .where(eq(bookSchema.id, bookId));
  const book = fetchBookResponse[0];

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const fetchBookingResponse = await db
    .select()
    .from(booking)
    .where(and(eq(booking.bookId, bookId), isNull(booking.returnedAt)));
  const isBookAvailable = book.quantity > fetchBookingResponse.length;
  if (!isBookAvailable) {
    return NextResponse.json(
      { error: "All the copies of this book have been booked" },
      { status: 400 }
    );
  }

  const fetchUserResponse = await db
    .select()
    .from(booking)
    .where(
      and(eq(booking.userId, session.user.id), isNull(booking.returnedAt))
    );
  const activeBookings = fetchUserResponse.length;
  if (activeBookings >= 3) {
    return NextResponse.json(
      { error: "User has exceed booking limit" },
      { status: 400 }
    );
  }

  if (fetchUserResponse.find((booking) => booking.bookId === bookId)) {
    return NextResponse.json(
      { error: "User has already booked this book" },
      { status: 400 }
    );
  }

  const createBookingResponse = await db
    .insert(booking)
    .values({
      id: crypto.randomUUID(),
      bookId: bookId,
      userId: session?.user.id as string,
      dueDate: new Date(dueDate),
    })
    .returning();

  return NextResponse.json({ id: createBookingResponse[0].id });
}
