import BookList from "../components/Booklist";
import Search from "../components/Search";
import CategoryList from "../components/CategoryList";
import { Separator } from "@/components/ui/separator";

interface Props {
  searchParams: {
    page?: string;
    query?: string;
    category?: string;
  };
}

export default function Page({ searchParams }: Props) {
  return (
    <div className="flex min-h-screen flex-col p-4 lg:py-8 lg:px-16 mt-16 gap-4">
      <div className="relative">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">All books</h1>
            <p className="text-neutral-500 text-sm">
              These are all the books that are available in SecurityPal library.
            </p>
          </div>
          <div>
            <Search />
          </div>
        </div>
        <Separator className="absolute -bottom-4 w-screen -left-4  lg:-left-16" />
      </div>
      <div className="pt-4 pb-2">
        <CategoryList />
      </div>
      <BookList
        searchTerm={searchParams.query}
        category={searchParams.category}
      />
    </div>
  );
}
