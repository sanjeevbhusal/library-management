import fetchUserBooks from "@/actions/fetchUserBooks";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import columns from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const currentlyTakenBooks = await fetchUserBooks(
    session?.user.id as string,
    true
  );
  const returnedBooks = await fetchUserBooks(session?.user.id as string, false);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Currently Taken books</h1>
        <p className="text-neutral-500 text-sm">
          These are all the books that you have currently taken and should
          return before the deadline.
        </p>
        <DataTable columns={columns} data={currentlyTakenBooks} />
        <div className="relative mt-8">
          <Separator className="absolute -left-2 lg:-left-16 w-screen" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Returned books</h1>
        <p className="text-neutral-500 text-sm">
          These are all the books that you have taken in the past and have
          already returned.
        </p>
        <DataTable columns={columns} data={returnedBooks} />
        <div className="relative mt-8">
          <Separator className="absolute -left-2 lg:-left-16 w-screen" />
        </div>
      </div>
    </div>
  );
}

// p-2 lg:py-8 lg:px-16
