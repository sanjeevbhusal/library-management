import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Review, User } from "@/drizzle/types";
import { faker } from "@faker-js/faker";
import { AiOutlineStar } from "react-icons/ai";

type ReviewWithAuthor = Review & { author: User };

interface Props {
  reviews: ReviewWithAuthor[];
}

function getUserInitials(user: User) {
  // if there is only firstname, then get the first 2 characters.
  // if there is a first name and the lastname, then get the first character from firstname and first character from last name.

  const nameList = user.name.split(" ");
  const firstName = nameList[0];
  const lastName = nameList[nameList.length - 1];

  let userInitilas = firstName[0].toUpperCase();
  if (lastName) {
    userInitilas += lastName[0].toUpperCase();
  }
  return userInitilas;
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
                    <AvatarImage
                      src={
                        review.author.imageUrl ||
                        "https://github.com/shadcn.png"
                      }
                    />
                    <AvatarFallback>
                      {getUserInitials(review.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-neutral-600">
                    <p className="font-semibold">{review.author.name}</p>
                    <p>{review.author.jobTitle || faker.person.jobTitle()}</p>
                  </div>
                </div>
                <div className="flex text-yellow-500 text-sm">
                  {new Array(parseInt(review.rating || "0")).fill(
                    <AiOutlineStar />
                  )}
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
