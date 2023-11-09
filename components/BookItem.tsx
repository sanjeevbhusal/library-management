"use client";

import { Book, Booking } from "@/drizzle/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { BsFillPersonFill } from "react-icons/bs";
import { TbCategory } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import { AiFillStar } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "./ui/use-toast";
import Link from "next/link";

interface Props {
  book: Book;
  booking: Booking[];
  userBookings: Booking[];
}

function BookItem({ book, booking, userBookings }: Props) {
  const user = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast, dismiss } = useToast();

  async function createBooking() {
    setIsLoading(true);
    try {
      await axios.post(`/api/bookings`, {
        bookId: book.id,
        dueDate: date,
      });

      const { dismiss } = toast({
        description: (
          <p>
            Booking created successfully. You can manage your booking{" "}
            <Link href={`/manage-books`}>
              <span className="font-bold underline" onClick={() => dismiss()}>
                here
              </span>
            </Link>
          </p>
        ),

        duration: 10000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong while booking.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }

    console.log(date);
  }

  return (
    <div className="flex grow flex-col">
      <div className="w-screen absolute lg:static lg:w-full left-0">
        <Image
          src={
            "https://a0.muscache.com/im/pictures/miso/Hosting-10989371/original/46c0c87f-d9bc-443c-9b64-24d9e594b54c.jpeg?im_w=720"
          }
          alt="book picture"
          height={350}
          width={250}
          className="w-full h-[350px] lg:rounded-2xl"
        />
      </div>
      <h3 className="font-semibold text-2xl mt-[370px] lg:mt-[20px]">
        {book.name}
      </h3>
      <div className=" border border-gray-300 rounded-lg px-12 md:px-20 lg:px-28 py-4 flex items-center justify-between mt-6 font-medium">
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
      {/* Implement Available or Not Available for this User. The book might be sold out or the user might have reached the max limit */}
      {book.quantity <= booking.length && (
        <Alert variant={"destructive"} className="mt-8">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            This book is not available right now since all copies of this book
            have been booked already.
          </AlertDescription>
        </Alert>
      )}

      {userBookings.length >= 3 && (
        <Alert variant={"destructive"} className="mt-8">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You have already booked 3 books. Please return some of the books if
            you wish to buy more.
          </AlertDescription>
        </Alert>
      )}

      <h1 className="mt-16 text-lg">When will you return this book ?</h1>
      <div className="mt-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-8 flex bg-red-500 items-stretch ">
        <AlertDialog
          open={showConfirmation}
          // onOpenChange={(event) => {
          //   console.log(event);
          //   setShowConfirmation(!showConfirmation);
          // }}
        >
          <AlertDialogTrigger className="w-full" asChild>
            <Button
              size={"lg"}
              className={cn("w-full", {
                "cursor-not-allowed":
                  book.quantity <= booking.length || userBookings.length >= 3,
              })}
              disabled={
                book.quantity <= booking.length || userBookings.length >= 3
              }
              onClick={() => setShowConfirmation(true)}
            >
              Book Now
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Booking ?</AlertDialogTitle>
              <AlertDialogDescription>
                You have selected to return the book at{" "}
                <span className="font-bold">{format(date!, "PPP")}</span>.
                Please make sure the date is correct
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowConfirmation(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={createBooking} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* <div className="mt-8">
            <ReviewList reviews={reviews} />
          </div>
          <div className="mt-8">
            <RecentBookings bookings={recentBookings} />
          </div> */}
    </div>
  );
}

export default BookItem;
