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
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">All books</h1>
        <p className="text-neutral-500 text-sm">
          These are all the books that are available in SecurityPal library.
        </p>
        <div className="lg:ml-auto">
          <Search />
        </div>
      </div>
      <BookList searchTerm={searchParams.query || ""} />{" "}
    </div>
  );
}
