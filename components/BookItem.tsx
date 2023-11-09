"use client";

import { Book, Booking, Review } from "@/drizzle/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookCheck, Loader2, Terminal } from "lucide-react";
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
import BookInfo from "@/app/components/BookInfo";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

interface Props {
  book: Book;
  activeBookBookings: Booking[];
  activeUserBookings: Booking[];
  userBookReview: Review | null;
}

const schema = z.object({
  review: z.string().min(50, "Please write at least 50 characters"),
});

type FormValues = z.infer<typeof schema>;

function BookItem({
  book,
  activeBookBookings,
  activeUserBookings,
  userBookReview,
}: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  console.log("Date", date);

  const user = useSession();
  const { toast, dismiss } = useToast();

  const form = useForm<FormValues>({
    defaultValues: {
      review: "",
    },
    resolver: zodResolver(schema),
  });

  async function createReview(values: FormValues) {}

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

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong while booking.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
      setDate(new Date());
    }
  }

  const isBookAvailable = activeBookBookings.length < book.quantity;
  const isUserEligible = activeUserBookings.length < 3;
  const bookAlreadyRented = !!activeUserBookings.find(
    (booking) => booking.bookId === book.id
  );
  const hasWrittenReview = !!userBookReview;

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

      <BookInfo book={book} />

      {!isBookAvailable ? (
        <Alert variant={"destructive"} className="mt-8">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            This book is not available right now since all copies of this book
            have been booked already.
          </AlertDescription>
        </Alert>
      ) : !isUserEligible ? (
        <Alert variant={"destructive"} className="mt-8">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You have already booked 3 books. Please return some of the books if
            you wish to buy more.
          </AlertDescription>
        </Alert>
      ) : bookAlreadyRented ? (
        <Alert variant={"destructive"} className="mt-8">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You have already rented this book. You cannot rent the same book
            more than once.
          </AlertDescription>
        </Alert>
      ) : (
        <>
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
        </>
      )}

      <div className="mt-8 flex items-stretch ">
        <AlertDialog open={showConfirmation}>
          <AlertDialogTrigger className="w-full" asChild>
            <Button
              size={"lg"}
              className={cn("w-full", {
                "cursor-not-allowed":
                  !isBookAvailable || !isUserEligible || bookAlreadyRented,
              })}
              disabled={
                !isBookAvailable || !isUserEligible || bookAlreadyRented
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

      {bookAlreadyRented ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(createReview)} className="mt-8">
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div>
                      <h3 className="text-xl font-semibold">Write a Review</h3>
                      <p className="mt-4 text-sm font-normal">
                        Write about the book summary, the learnings, style of
                        presenting information etc
                      </p>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="This book reflects the realities of modern world and its ...."
                      style={{
                        marginTop: "28px",
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Please write at least 50 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4 w-full" size={"lg"}>
              Submit Review
            </Button>
          </form>
        </Form>
      ) : null}

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Reviews</h3>
        <p className="font-medium text-base text-gray-500 mt-4">
          No Reviews Available
        </p>
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
