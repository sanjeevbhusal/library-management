import BookList from "./components/Booklist";
import NavBar from "./components/NavBar";
import React from "react";
import Search from "./components/Search";
import { getServerSession } from "next-auth";
import MostPopularBooks from "@/components/MostPopularBooks";
import YourBooks from "@/components/YourBooks";

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="flex min-h-screen flex-col p-4 lg:py-8 lg:px-16 mt-16">
      <div className="flex flex-col gap-8 justify-between">
        <div className="pb-8 border-b">
          <YourBooks />
        </div>
        <div>
          <MostPopularBooks />
        </div>
      </div>
    </main>
  );
}
