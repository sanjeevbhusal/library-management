import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "dotenv/config";
import Provider from "../providers/SessionProvider";
import { getServerSession } from "next-auth";
import NotLoggedInScreen from "./components/NotLoggedInScreen";
import NavBar from "./components/NavBar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Library Management System",
  description: "A application used to manage books",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // make sure the user is available.
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <NavBar session={session} />
          {!session ? <NotLoggedInScreen /> : children}
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
