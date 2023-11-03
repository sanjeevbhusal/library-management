import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AiOutlineStar } from "react-icons/ai";

interface Review {
  reviewer: { id: string; imageUrl: string; name: string; jobTitle: string };
  star: number;
  content: string;
}

interface Props {
  reviews: Review[];
}

function ReviewList({ reviews }: Props) {
  return (
    <div>
      <h1 className="font-bold text-lg">Reviews</h1>
      <div className="flex flex-col lg:flex-row gap-4 flex-wrap mt-4">
        {reviews.map((review) => {
          return (
            <div
              className="border border-black rounded-lg p-2 grow lg:basis-80"
              key={review.content}
            >
              <div className="flex justify-between">
                <div className="flex gap-2 ">
                  <Avatar>
                    <AvatarImage src={review.reviewer.imageUrl} />
                    <AvatarFallback>SB</AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-neutral-600">
                    <p className="font-semibold">{review.reviewer.name}</p>
                    <p>{review.reviewer.jobTitle}</p>
                  </div>
                </div>
                <div className="flex text-yellow-500 text-sm">
                  {new Array(review.star).fill(<AiOutlineStar />)}
                </div>
              </div>
              <p className="mt-2 text-sm">{review.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReviewList;
