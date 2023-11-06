import { Book } from "@/drizzle/types";
import Image from "next/image";
import Link from "next/link";
import ms from "ms";

interface BookItemProps {
  book: Book;
  bookedAt?: Date;
}

function getRelativeDate(date: Date) {
  return `${ms(Date.now() - date.getTime())} ago`;
}

function BookItem({ book, bookedAt }: BookItemProps) {
  console.log(bookedAt);
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
        <div className="mt-1 text-sm text-neutral-500 flex justify-between">
          <p className="text-sm">{book.author}</p>
          {bookedAt && (
            <p className="font-normal">{getRelativeDate(bookedAt)}</p>
          )}
        </div>
      </Link>
    </div>
  );
}

export default BookItem;
