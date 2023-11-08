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
    <div className="flex min-h-screen flex-col p-4 lg:py-8 lg:px-16 mt-16 gap-4">
      <h1 className="text-2xl font-semibold">Manage books</h1>
      <p className="text-neutral-500 text-sm">
        These are all the books that are available in SecurityPal Library. You
        can view, edit and delete these books.
      </p>
      <DataTable columns={uploadedBooksColumn} data={uploadedBooks} />
      <div className="relative mt-8">
        <Separator className="absolute -left-2 lg:-left-16 w-screen" />
      </div>
    </div>
  );
}
