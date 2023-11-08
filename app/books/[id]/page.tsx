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
import fetchBook from "@/actions/fetchBook";
import { BsFillPersonFill } from "react-icons/bs";
import { TbCategory } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import { AiFillStar } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import fetchBooking from "@/actions/fetchBooking";
// import { getExampleTable } from "@/drizzle/schema";;
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import fetchUserBookings from "@/actions/fetchUserBookings";

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
  const booking = await fetchBooking(params.id);
  const userBookings = await fetchUserBookings();
  // const reviews = await fetchReviews(params.id);
  // const recentBookings = await fetchRecentBookings(params.id);

  //   <h1>This book doesnot exist.No Book Found with this Search.</h1>
  //   <p>Try again with different search values.</p>
  // </div>

  return (
    <main className="flex min-h-screen flex-col p-4 lg:py-8 lg:px-16 mt-14 lg:mt-16 py-0 max-w-6xl mx-auto">
      {!book && (
        <div className="grow flex items-center justify-center">
          <h1>This book doesnot exist</h1>
        </div>
      )}
      {book && (
        <div className="flex flex-col grow relative">
          <Image
            src={
              book.imageUrl ||
              "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="book picture"
            height={384}
            width={500}
            className="w-full h-[500px] absolute"
          />
          <h3 className="font-semibold text-2xl mt-[520px]">{book.name}</h3>
          <div className="border border-gray-300 rounded-lg px-12 md:px-20 lg:px-28 py-4 flex items-center justify-between mt-8 font-medium">
            <div className="flex flex-col items-center">
              {/* TODO: Implement Rating */}
              <p>4.82</p>
              <div className="flex gap-1 ">
                {new Array(5).fill(0).map((_) => (
                  <AiFillStar key={_} size={9} />
                ))}
              </div>
            </div>
            <Separator
              orientation="vertical"
              className="w-[1px] h-10 bg-gray-300"
            />
            {/* TODO: Implement Popularity */}
            <div>Extremely popular</div>
            <Separator
              orientation="vertical"
              className="w-[1px] h-10 bg-gray-300"
            />

            <div className="flex flex-col items-center">
              {/* TODO: Implement Review Count, Implement if pressed go to reviews section feature */}
              <p>20</p>
              <p className="text-xs underline">Reviews</p>
            </div>
          </div>
          <div className="relative mt-8">
            <Separator className=" text-gray-400 absolute w-screen -left-4" />
          </div>
          <div className="text-neutral-500 flex-col text-sm flex gap-4 mt-4">
            <div className="flex gap-4 mt-4">
              <BsFillPersonFill size={24} className="text-black" />{" "}
              <div className="text-gray-500 text-sm -mt-1">
                <p className="text-black text-base font-semibold">
                  {book.author}
                </p>
                <p className="mt-1">
                  Specializes in Thriller, Romantic and Fiction Books
                </p>
              </div>
            </div>
            <div className="flex gap-6 mt-4">
              <TbCategory size={24} className="text-black" />{" "}
              <div className="text-gray-500 text-sm -mt-1">
                <p className="text-black text-base font-semibold">
                  {book.category}
                </p>
              </div>
            </div>
          </div>
          {/* Implement Available or Not Available for this User. The book might be sold out or the user might have reached the max limit */}
          {book.quantity <= booking.length && (
            <Alert variant={"destructive"} className="mt-8">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                This book is not available right now since all copies of this
                book have been booked already.
              </AlertDescription>
            </Alert>
          )}

          {userBookings.length >= 3 && (
            <Alert variant={"destructive"} className="mt-8">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                This book is not available right now since you have exceeded the
                booking limit. Please return some of other books if you wish to
                rent this book.
              </AlertDescription>
            </Alert>
          )}

          <Button
            size={"lg"}
            className={cn("mt-8", {
              "cursor-not-allowed":
                book.quantity <= booking.length || userBookings.length >= 3,
            })}
            disabled={
              book.quantity <= booking.length || userBookings.length >= 3
            }
          >
            Book Now
          </Button>

          {/* <div className="mt-8">
            <ReviewList reviews={reviews} />
          </div>
          <div className="mt-8">
            <RecentBookings bookings={recentBookings} />
          </div> */}
        </div>
      )}
    </main>
  );
}
