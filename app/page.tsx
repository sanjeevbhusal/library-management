import BookList from "./components/Booklist";
import NavBar from "./components/NavBar";
import React from "react";
import Search from "./components/Search";
import { getServerSession } from "next-auth";

// You can continue this list with more real books and details.
interface Props {
  searchParams: {
    page?: string;
    query?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const session = await getServerSession();

  return (
    <main className="flex min-h-screen flex-col p-4 lg:py-8 lg:px-16">
      <NavBar />
      {session?.user ? (
        <>
          <div className="flex flex-col lg:flex-row gap-2 justify-between mt-16">
            <h1 className="font-medium text-base lg:text-2xl">
              Available Books
            </h1>
            <Search />
          </div>
          <BookList searchTerm={searchParams.query || ""} />
        </>
      ) : (
        <div className="mt-16 grow flex items-center justify-center">
          Please login to access the application.
        </div>
      )}
    </main>
  );
}
