"use client";

import { Session, getServerSession } from "next-auth";
import Link from "next/link";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BiSolidBookOpen } from "react-icons/bi";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const navLinks = [
  {
    label: "Upload Book",
    icon: AiOutlineCloudUpload,
    route: "/upload",
  },
  {
    label: "All books",
    icon: BiSolidBookOpen,
    route: "/",
  },
];

interface Props {
  session: Session | null;
}

function NavBar({ session }: Props) {
  return (
    <div className="flex justify-between items-center  bg-sky-400  py-4 px-4 lg:px-16 absolute left-0 right-0 top-0">
      <Link href="/">
        <h1 className="font-semibold text-sm lg:text-lg">Library</h1>
      </Link>
      {session?.user ? (
        <div className="flex gap-4">
          {navLinks.map((navLink) => {
            const Icon = navLink.icon;

            return (
              <Link href={navLink.route} key={navLink.label}>
                <div className="flex gap-2 items-center cursor-pointer text-xs lg:text-base">
                  <Icon />
                  <span>{navLink.label}</span>
                </div>
              </Link>
            );
          })}

          <button className="border px-2" onClick={() => signOut()}>
            Signout
          </button>
        </div>
      ) : (
        <Button size="sm" onClick={() => signIn("google")}>
          Login
        </Button>
      )}
    </div>
  );
}

export default NavBar;
