import { db } from "@/drizzle";
import { getServerSession, User } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { user as userTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const f = createUploadthing();

async function auth(req: Request) {
  const session = await getServerSession();
  return session?.user;
} // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: {} })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");

      const dbUser = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, user.email as string));

      return { userId: dbUser[0].id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
      // return file.url;
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
