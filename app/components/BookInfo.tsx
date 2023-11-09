import { Separator } from "@/components/ui/separator";
import { Book } from "@/drizzle/types";
import { AiFillStar } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { TbCategory } from "react-icons/tb";

interface Props {
  book: Book;
}

function BookInfo({ book }: Props) {
  return (
    <div className="flex flex-col">
      <h3 className="font-semibold text-2xl mt-[370px] lg:mt-[20px]">
        {book.name}
      </h3>
      <div className=" border border-gray-300 rounded-lg px-4  md:px-20 lg:px-28 py-4 flex items-center justify-between mt-6 font-medium">
        <div className="flex flex-col items-center">
          {/* TODO: Implement Rating */}
          <p>4.82</p>
          <div className="flex gap-1 ">
            {new Array(5).fill(0).map((value, index) => (
              <AiFillStar key={index} size={9} />
            ))}
          </div>
        </div>
        <Separator
          orientation="vertical"
          className="w-[1px] h-10 bg-gray-300"
        />
        {/* TODO: Implement Popularity */}
        <div>Extremely popular</div>
        <Separator
          orientation="vertical"
          className="w-[1px] h-10 bg-gray-300"
        />

        <div className="flex flex-col items-center">
          {/* TODO: Implement Review Count, Implement if pressed go to reviews section feature */}
          <p>20</p>
          <p className="text-xs underline">Reviews</p>
        </div>
      </div>
      <div className="relative mt-8">
        <Separator className="absolute -left-4 w-screen" />
      </div>

      <div className="text-neutral-500 flex-col text-sm flex gap-4 mt-4">
        <div className="flex gap-4 mt-4">
          <BsFillPersonFill size={24} className="text-black" />{" "}
          <div className="text-gray-500 text-sm -mt-1">
            <p className="text-black text-base font-semibold">{book.author}</p>
            <p className="mt-1">
              Specializes in Thriller, Romantic and Fiction Books
            </p>
          </div>
        </div>
        <div className="flex gap-6 mt-4">
          <TbCategory size={24} className="text-black" />{" "}
          <div className="text-gray-500 text-sm -mt-1">
            <p className="text-black text-base font-semibold">
              {book.category}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookInfo;
