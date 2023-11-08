import fetchUserBooks from "@/actions/fetchUserBooks";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { uploadedBooksColumn } from "../your-books/columns";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import fetchUploadedBooks from "@/actions/fetchUploadedBooks";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const uploadedBooks = await fetchUploadedBooks(session?.user.id as string);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Uploaded books</h1>
      <p className="text-neutral-500 text-sm">
        These are all the books that you have uploaded.
      </p>
      <DataTable columns={uploadedBooksColumn} data={uploadedBooks} />
      <div className="relative mt-8">
        <Separator className="absolute -left-2 lg:-left-16 w-screen" />
      </div>
    </div>
  );
}

// p-2 lg:py-8 lg:px-16
