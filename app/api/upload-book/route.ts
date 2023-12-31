import { db } from "@/drizzle";
import { book } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import authOptions from "../auth/[...nextauth]/authOptions";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().min(1, "ImageUrl is required"),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const dto = await request.json();
  const parsedDto = formSchema.safeParse(dto);

  if (!parsedDto.success) {
    return NextResponse.json({ error: parsedDto.error }, { status: 400 });
  }

  const existingBook = await db
    .select()
    .from(book)
    .where(eq(book.name, parsedDto.data.name));

  if (existingBook.length > 0) {
    return NextResponse.json(
      { error: "Book with this name already exists." },
      { status: 409 }
    );
  }

  const response = await db
    .insert(book)
    .values({
      id: crypto.randomUUID(),
      ...parsedDto.data,
      uploadedBy: session?.user?.id as string,
    })
    .returning({ id: book.id });
  const bookId = response[0].id;

  return NextResponse.json({ bookId }, { status: 201 });
}
