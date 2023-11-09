import { faker } from "@faker-js/faker";
import RecentBookings from "@/app/components/RecentBookings";
import { db } from "@/drizzle";
import { book, review, user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { Review, User } from "@/drizzle/types";
import React from "react";
import fetchBook from "@/actions/fetchBook";
import fetchBooking from "@/actions/fetchBooking";
import Image from "next/image";
// import { getExampleTable } from "@/drizzle/schema";;

import fetchUserBookings from "@/actions/fetchUserBookings";
import BookItem from "@/components/BookItem";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";

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
  params: { id: string };
}

type ReviewWithAuthor = Review & { author: User };

async function fetchReviews(bookId: string): Promise<ReviewWithAuthor[]> {
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

function fetchRecentBookings(bookId: string) {
  return generateRandomBookings(10); // Generate 10 random bookings
}

export default async function Page({ params }: Props) {
  const book = await fetchBook(params.id);
  const bookBooking = await fetchBooking(params.id);
  const userBookings = await fetchUserBookings();
  // const reviews = await fetchReviews(params.id);
  // const recentBookings = await fetchRecentBookings(params.id);

  //   <h1>This book doesnot exist.No Book Found with this Search.</h1>
  //   <p>Try again with different search values.</p>
  // </div>
  // return (
  //   <div className="flex mt-16 bg-green-500 flex-col w-20">
  //     <div className="bg-red-500 w-24">Child 1</div>
  //     <div className="bg-blue-500">Child2</div>
  //     <div className="w-24">
  //       <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
  //     </div>
  //     <div className="w-32">
  //       <Image
  //         src={
  //           "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  //         }
  //         alt="book picture"
  //         height={250}
  //         width={250}
  //         // className="w-screen h-[500px]"
  //         className="w-32 border-4 border-red-500"
  //       />
  //     </div>
  //   </div>
  // );

  return (
    <main className="flex min-h-screen px-4 pb-4 mt-14 lg:py-8 lg:px-16 lg:mt-16 max-w-6xl mx-auto">
      {!book && (
        <div className="grow flex items-center justify-center">
          <h1>This book doesnot exist</h1>
        </div>
      )}
      {book && (
        <BookItem
          book={book}
          booking={bookBooking}
          userBookings={userBookings}
          key={book.id}
        />
      )}
    </main>
  );
}
