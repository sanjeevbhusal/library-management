import { useSearchParams } from "next/navigation";
import BookList from "../components/Booklist";
import Search from "../components/Search";

interface Props {
  searchParams: {
    page?: string;
    query?: string;
  };
}

export default function Page({ searchParams }: Props) {
  return (
    <div className="flex min-h-screen flex-col p-4 lg:py-8 lg:px-16 mt-16 gap-4">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <h1 className="font-medium text-base lg:text-2xl">Available Books</h1>
        <Search />
      </div>
      <BookList searchTerm={searchParams.query || ""} />{" "}
    </div>
  );
}
