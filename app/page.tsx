import BookList from "./components/Booklist";
import NavBar from "./components/NavBar";
import React from "react";
import Search from "./components/Search";
import { getServerSession } from "next-auth";
import { db } from "@/drizzle";
import { book, booking } from "@/drizzle/schema";
import { sql } from "@vercel/postgres";
import { Book } from "@/drizzle/types";
import MostPopularBooks from "@/components/MostPopularBooks";
import YourBooks from "@/components/YourBooks";

// You can continue this list with more real books and details.
interface Props {
  searchParams: {
    page?: string;
    query?: string;
  };
}
// Jun page ma gayeni certain code run hunu parxa. Hence, the root layout should be invoked.
export default async function Home({ searchParams }: Props) {
  const session = await getServerSession();

  // give me the most booked bookings.

  return (
    <main className="flex min-h-screen flex-col p-4 lg:py-8 lg:px-16">
      {session?.user ? (
        <>
          <div className="flex flex-col gap-8 justify-between mt-16">
            <div className="pb-8 border-b">
              <YourBooks />
            </div>
            <div>
              <MostPopularBooks />
            </div>
            {/* <h1 className="font-medium text-base lg:text-2xl">
              Available Books
            </h1>
            <Search />
            <BookList searchTerm={searchParams.query || ""} /> */}
          </div>
        </>
      ) : null}
    </main>
  );
}
