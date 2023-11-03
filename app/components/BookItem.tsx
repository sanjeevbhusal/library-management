import { Book } from "@/drizzle/types";
import Image from "next/image";
import Link from "next/link";

interface BookItemProps {
  book: Book;
}

function BookItem({ book }: BookItemProps) {
  return (
    <div className="basis-72 grow md:grow-0">
      <Link href={`books/${book.id}`}>
        <Image
          src={book.imageUrl}
          alt="book picture"
          height={250}
          width={250}
          className="rounded-lg w-full h-64"
        />
        <div className="mt-2 font-semibold text-sm flex justify-between">
          <p className="text-sm">{book.name}</p>
          <p className="font-normal">{book.category}</p>
        </div>
        <p className="text-neutral-500 text-sm mt-1">{book.author}</p>
      </Link>
    </div>
  );
}

export default BookItem;
