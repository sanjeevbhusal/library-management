"use client";

import { Book, Booking, Review, User } from "@/drizzle/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookCheck, Loader2, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { BsFillPersonFill } from "react-icons/bs";
import { TbCategory } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
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
import { Input } from "./ui/input";
import { faker } from "@faker-js/faker";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ReviewWithUser } from "@/actions/bookReviews";

interface Props {
  book: Book;
  activeBookBookings: Booking[];
  activeUserBookings: Booking[];
  userBookReview: Review | null;
  bookReviews: ReviewWithUser[];
  weeklyBookRanking: number;
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

const schema = z.object({
  review: z.string().min(50, "Please write at least 50 characters"),
  rating: z
    .string({ required_error: "Please give a rating between 1 to 5" })
    .refine((value) => {
      const parsedValue = parseInt(value);
      return parsedValue >= 1 && parsedValue <= 5;
    }, "Please give a rating between 1 to 5"),
});

type FormValues = z.infer<typeof schema>;

function BookItem({
  book,
  activeBookBookings,
  activeUserBookings,
  userBookReview,
  bookReviews,
  weeklyBookRanking,
}: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showReviewUpdateConfirmation, setShowReviewUpdateConfirmation] =
    useState(false);
  const router = useRouter();
  const session = useSession();
  console.log(session);

  console.log("Date", date);
  const { toast, dismiss } = useToast();

  const form = useForm<FormValues>({
    defaultValues: {
      review: "",
      rating: "",
    },
    resolver: zodResolver(schema),
  });

  const updateReviewForm = useForm<FormValues>({
    defaultValues: {
      review: userBookReview?.content,
      rating: userBookReview?.rating || "",
    },
    resolver: zodResolver(schema),
  });

  async function createReview(values: FormValues) {
    try {
      await axios.post(`/api/review`, {
        bookId: book.id,
        content: values.review,
        rating: values.rating,
      });

      toast({
        description: "Review added successfully",
        duration: 5000,
      });

      form.reset();

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong while submitting review.",
      });
      console.log(error);
    }
  }

  async function updateReview(values: FormValues) {
    try {
      await axios.put(`/api/review/${userBookReview?.id}`, {
        bookId: book.id,
        content: values.review,
        rating: values.rating,
      });

      toast({
        description: "Review updated successfully",
        duration: 5000,
      });

      form.reset();
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong while updating review.",
      });
      console.log(error);
    } finally {
      setShowReviewUpdateConfirmation(false);
    }
  }

  async function createBooking() {
    setIsBooking(true);
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
      setIsBooking(false);
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
          src={book.imageUrl}
          alt="book picture"
          height={350}
          width={250}
          className="w-full h-[350px] lg:rounded-2xl"
        />
      </div>

      <BookInfo
        book={book}
        reviewCount={bookReviews.length + (userBookReview ? 1 : 0)}
        reviews={
          userBookReview ? [userBookReview, ...bookReviews] : bookReviews
        }
        weeklyBookRanking={weeklyBookRanking}
      />

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
              <AlertDialogAction onClick={createBooking} disabled={isBooking}>
                {isBooking ? <Loader2 className="animate-spin" /> : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {bookAlreadyRented && !userBookReview ? (
        <div className="mt-8">
          <h3 className="text-xl font-semibold">Write a Review</h3>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(createReview)}
              className="space-y-8 py-4"
            >
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      Write about the book summary, the learnings, style of
                      presenting information etc. Please write at least 50
                      characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Give Rating</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Out of 1 to 5, how would you rate this book ?
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="mt-4 w-full"
                size={"lg"}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Submit Review"
                )}
              </Button>
            </form>
          </Form>
        </div>
      ) : null}

      <div className="flex flex-col gap-8 mt-8" id="reviews">
        {userBookReview && session.data ? (
          <div>
            <h3 className="text-xl font-semibold">Your Review</h3>
            <div
              className="border border-black rounded-lg p-2 grow lg:basis-80 mt-4"
              key={userBookReview.id}
            >
              <div className="flex justify-between">
                <div className="flex gap-2 ">
                  <Avatar>
                    <AvatarImage
                      src={
                        session.data?.user.image ||
                        "https://github.com/shadcn.png"
                      }
                    />
                    <AvatarFallback>
                      {getUserInitials(session.data?.user as User)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-neutral-600">
                    <p className="font-semibold">{session.data?.user.name}</p>
                    <p>
                      {session.data?.user.jobTitle || faker.person.jobTitle()}
                    </p>
                  </div>
                </div>
                <div className="flex text-yellow-500 text-sm">
                  {new Array(parseInt(userBookReview.rating || "0")).fill(
                    <AiOutlineStar />
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm">{userBookReview.content}</p>
            </div>
            <div className="mt-2">
              <AlertDialog open={showReviewUpdateConfirmation}>
                <AlertDialogTrigger
                  className="block text-sm ml-auto border-b border-black"
                  onClick={() => setShowReviewUpdateConfirmation(true)}
                >
                  Update Review
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Update Review</AlertDialogTitle>
                    <AlertDialogDescription>
                      <Form {...updateReviewForm}>
                        <form
                          onSubmit={updateReviewForm.handleSubmit(updateReview)}
                          className="space-y-8 py-4"
                        >
                          <FormField
                            control={updateReviewForm.control}
                            name="review"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Review</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormDescription>
                                  Write about the book summary, the learnings,
                                  style of presenting information etc. Please
                                  write at least 50 characters
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={updateReviewForm.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Give Rating</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Out of 1 to 5, how would you rate this book ?
                                </FormDescription>

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() =>
                                setShowReviewUpdateConfirmation(false)
                              }
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              disabled={updateReviewForm.formState.isSubmitting}
                              type="submit"
                            >
                              {updateReviewForm.formState.isSubmitting ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                "Update"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </form>
                      </Form>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : null}

        <div>
          <h3 className="text-xl font-semibold">Reviews</h3>
          <p className="font-medium text-base text-gray-500 mt-4">
            {bookReviews.length === 0
              ? "No Reviews Available"
              : bookReviews.map((review) => {
                  return (
                    <div
                      className="border border-black rounded-lg p-2 grow lg:basis-80 mt-4"
                      key={review.id}
                    >
                      <div className="flex justify-between">
                        <div className="flex gap-2 ">
                          <Avatar>
                            <AvatarImage
                              src={
                                review.user.image ||
                                "https://github.com/shadcn.png"
                              }
                            />
                            <AvatarFallback>
                              {getUserInitials(review.user)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm text-neutral-600">
                            <p className="font-semibold">{review.user.name}</p>
                            <p>
                              {review.user.jobTitle || faker.person.jobTitle()}
                            </p>
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
          </p>
        </div>
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
