import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import authOptions from "../../auth/[...nextauth]/authOptions";
import { db } from "@/drizzle";
import { review } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

interface Params {
  params: {
    id: string;
  };
}

const schema = z.object({
  content: z.string().min(50),
  rating: z.enum(["1", "2", "3", "4", "5"]),
});

export async function PUT(request: NextRequest, { params }: Params) {
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

  const reviewId = params.id;
  const userId = session.user.id;

  const response = await db
    .select()
    .from(review)
    .where(and(eq(review.id, reviewId), eq(review.userId, userId)));
  const existingReview = response[0];

  if (!existingReview) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const { content, rating } = parsedDto;

  await db
    .update(review)
    .set({
      content,
      rating,
    })
    .where(and(eq(review.id, reviewId), eq(review.userId, userId)));

  return NextResponse.json({ success: true });
}
