import BookList from "./components/Booklist";
import NavBar from "./components/NavBar";
import React from "react";
import Search from "./components/Search";

// You can continue this list with more real books and details.
interface Props {
  searchParams: {
    page?: string;
    query?: string;
  };
}

export default function Home({ searchParams }: Props) {
  return (
    <main className="flex min-h-screen flex-col p-4 lg:py-8 lg:px-16">
      <NavBar />
      <div className="flex flex-col lg:flex-row gap-2 justify-between mt-16">
        <h1 className="font-medium text-base lg:text-2xl">Available Books</h1>
        <Search />
      </div>
      <BookList searchTerm={searchParams.query || ""} />
    </main>
  );
}
