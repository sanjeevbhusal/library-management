import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/drizzle";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  debug: true,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user: u }) {
      if (u) {
        const dbUser = await db.select().from(user).where(eq(user.id, u.id));

        token.id = dbUser[0].id;
        token.isAdmin = dbUser[0].isAdmin;
      }
      return token;
    },
    session({ session, token }) {
      const sessionWithUserInfo = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          isAdmin: token.isAdmin as boolean,
        },
      };
      return sessionWithUserInfo;
    },
  },
};

export default authOptions;
