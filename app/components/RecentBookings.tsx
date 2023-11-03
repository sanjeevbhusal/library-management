import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AiOutlineStar } from "react-icons/ai";

interface Bookings {
  reader: { id: string; imageUrl: string; name: string };
  date: string;
}

interface Props {
  bookings: Bookings[];
}

function RecentBookings({ bookings }: Props) {
  return (
    <div>
      <h1 className="font-bold text-lg">Recent Bookings</h1>
      <div className="flex flex-col lg:flex-row gap-4 flex-wrap mt-4">
        {bookings.map((booking) => {
          return (
            <div className="border border-black rounded-lg p-2 grow lg:basis-80">
              <div className="flex justify-between">
                <div className="flex gap-2 ">
                  <Avatar>
                    <AvatarImage src={booking.reader.imageUrl} />
                    <AvatarFallback>SB</AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-neutral-600">
                    <p className="font-semibold">Sanjeev Bhusal</p>
                    <p>Software Engineer</p>
                  </div>
                </div>
                <p className="text-neutral-500 text-sm">{booking.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentBookings;
