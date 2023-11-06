"use client";

import { getServerSession } from "next-auth";
import Link from "next/link";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BiSolidBookOpen } from "react-icons/bi";
import { signOut, useSession } from "next-auth/react";

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
function NavBar() {
  const { data } = useSession();

  return (
    <div className="flex justify-between items-center  bg-sky-400  py-4 px-4 lg:px-16 absolute left-0 right-0 top-0">
      <Link href="/">
        <h1 className="font-semibold text-sm lg:text-lg">Library</h1>
      </Link>
      {data?.user ? (
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
        <Link href="/api/auth/signin">
          <button className="border px-2">Signin</button>
        </Link>
      )}
    </div>
  );
}

export default NavBar;
