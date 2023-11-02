import Image from "next/image";
import Link from "next/link";

interface BookItemProps {
  book: any;
}

function BookItem({ book }: BookItemProps) {
  return (
    <div className="basis-72 grow md:grow-0">
      <Link href={`books/${book.id}`}>
        <Image
          src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="book picture"
          height={100}
          width={100}
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
