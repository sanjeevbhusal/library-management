"use client";

import { Session } from "next-auth";
import Link from "next/link";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BiSolidBookOpen } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const navLinks = [
  {
    label: "All books",
    icon: BiSolidBookOpen,
    route: "/all-books",
  },
  {
    label: "Upload Book",
    icon: AiOutlineCloudUpload,
    route: "/upload-book",
    adminOnly: true,
  },
  {
    label: "Your Library",
    icon: FiUser,
    route: "/your-library",
    adminOnly: true,
  },
];

interface Props {
  session: Session | null;
}

function NavBar({ session }: Props) {
  return (
    <div className="flex justify-between items-center  bg-sky-400  py-4 px-4 lg:px-16 fixed left-0 right-0 top-0">
      <Link href="/">
        <h1 className="font-semibold text-sm lg:text-lg">Library</h1>
      </Link>
      {session?.user ? (
        <div className="flex gap-4 items-center">
          {navLinks.map((navLink) => {
            if (navLink.adminOnly && session.user.isAdmin != true) return null;

            const Icon = navLink.icon;

            return (
              <Link href={navLink.route} key={navLink.label}>
                <div className="flex gap-2 items-center cursor-pointer text-xs lg:text-base">
                  <Icon />
                  <span className="text-base">{navLink.label}</span>
                </div>
              </Link>
            );
          })}

          <Button size="sm" onClick={() => signOut()}>
            Signout
          </Button>
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
