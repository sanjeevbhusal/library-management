import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import authOptions from "../auth/[...nextauth]/authOptions";
import { db } from "@/drizzle";
import { review } from "@/drizzle/schema";
import { getServerSession } from "next-auth";

const schema = z.object({
  bookId: z.string(),
  content: z.string().min(50),
  rating: z.enum(["1", "2", "3", "4", "5"]),
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

  let parsedDto: z.infer<typeof schema>;

  try {
    parsedDto = schema.parse(dto);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const { bookId, content, rating } = parsedDto;

  // you want to create a review

  const response = await db
    .insert(review)
    .values({
      id: crypto.randomUUID(),
      bookId,
      content,
      rating: rating,
      userId: session.user.id,
    })
    .returning();

  return NextResponse.json({ review: response }, { status: 201 });
}
