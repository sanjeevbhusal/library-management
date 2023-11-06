import NavBar from "@/app/components/NavBar";
import ReviewList from "@/app/components/ReviewList";
import Image from "next/image";
import { faker } from "@faker-js/faker";
import RecentBookings from "@/app/components/RecentBookings";
import { db } from "@/drizzle";
import { book, review, user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { Review, User } from "@/drizzle/types";
import React from "react";
// import { getExampleTable } from "@/drizzle/schema";;

function generateRandomBooking() {
  const booking = {
    reader: {
      id: faker.string.uuid(),
      imageUrl: faker.image.avatar(),
      name: faker.internet.userName(),
    },
    date: faker.date.recent().toDateString(),
  };
  return booking;
}

function generateRandomBookings(count: number) {
  const bookings = [];
  for (let i = 0; i < count; i++) {
    bookings.push(generateRandomBooking());
  }
  return bookings;
}

function generateRandomReview() {
  const review = {
    reviewer: {
      id: faker.string.uuid(),
      imageUrl: faker.image.avatar(),
      name: faker.internet.userName(),
      jobTitle: faker.person.jobTitle(),
    },
    star: Math.floor(Math.random() * 5) + 1, // Generates a random star rating from 1 to 5
    content: faker.lorem.paragraph(),
  };
  return review;
}

function generateRandomReviews(count: number) {
  const reviews = [];
  for (let i = 0; i < count; i++) {
    reviews.push(generateRandomReview());
  }
  return reviews;
}

interface Props {
  params: { id: number };
}

async function fetchBook(bookdId: number) {
  const b = await db.select().from(book).where(eq(book.id, bookdId));
  return b.length === 0 ? null : b[0];
}

type ReviewWithAuthor = Review & { author: User };

async function fetchReviews(bookId: number): Promise<ReviewWithAuthor[]> {
  const reviews = await db
    .select()
    .from(review)
    .leftJoin(user, eq(user.id, review.userId));

  const reviewWithAuthor = reviews.map(({ review, user }) => {
    return {
      ...review,
      author: user as User,
    };
  });

  return reviewWithAuthor;
}

function fetchRecentBookings(bookId: number) {
  return generateRandomBookings(10); // Generate 10 random bookings
}

export default async function Page({ params }: Props) {
  const book = await fetchBook(params.id);
  const reviews = await fetchReviews(params.id);
  const recentBookings = await fetchRecentBookings(params.id);

  //   <h1>This book doesnot exist.No Book Found with this Search.</h1>
  //   <p>Try again with different search values.</p>
  // </div>

  return (
    <main className="flex min-h-screen flex-col p-4 lg:py-8 lg:px-16">
      {!book && (
        <div className="mt-16 grow flex items-center justify-center">
          <h1>This book doesnot exist</h1>
        </div>
      )}
      {book && (
        <div className="mt-16 flex flex-col grow">
          <h3 className="font-semibold text-2xl">{book.name}</h3>
          <div className="text-neutral-500 text-sm flex gap-4 mt-2 underline">
            <p>{book.author}</p>
            <p>{book.category}</p>
          </div>
          <Image
            src={
              book.imageUrl ||
              "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="book picture"
            height={100}
            width={200}
            className="rounded-lg w-96 h-96 mt-8"
          />
          <button className="border px-6 py-2 bg-blue-500 rounded-md mt-6 w-full lg:w-96">
            Book Now
          </button>
          <div className="mt-8">
            <ReviewList reviews={reviews} />
          </div>
          <div className="mt-8">
            <RecentBookings bookings={recentBookings} />
          </div>
        </div>
      )}
    </main>
  );
}
