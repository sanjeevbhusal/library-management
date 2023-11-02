import NavBar from "@/app/components/NavBar";
import ReviewList from "@/app/components/ReviewList";
import Image from "next/image";
import { faker } from "@faker-js/faker";
import RecentBookings from "@/app/components/RecentBookings";

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

function fetchBook(bookdId: number) {
  return {
    id: 1,
    name: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Classic",
  };
}

function fetchReviews(bookId: number) {
  return generateRandomReviews(10);
}

function fetchRecentBookings(bookId: number) {
  return generateRandomBookings(10); // Generate 10 random bookings
}

export default async function Page({ params }: Props) {
  const book = await fetchBook(params.id);
  const reviews = await fetchReviews(params.id);
  const recentBookings = await fetchRecentBookings(params.id);

  return (
    <main className="flex min-h-screen flex-col p-4 lg:py-8 lg:px-16">
      <NavBar />
      <h3 className="mt-16 font-semibold text-2xl">{book.name}</h3>
      <div className="text-neutral-500 text-sm flex gap-4 mt-2 underline">
        <p>{book.author}</p>
        <p>{book.category}</p>
      </div>
      <Image
        src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
    </main>
  );
}
