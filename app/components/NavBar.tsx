"use client";

import { Session } from "next-auth";
import Link from "next/link";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BiSolidBookOpen } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const navLinks = [
  {
    label: "All books",
    icon: BiSolidBookOpen,
    route: "/all-books",
  },
  {
    label: "Your Books",
    route: "/your-books",
    adminOnly: true,
  },
  {
    label: "Upload Book",
    route: "/upload-book",
    adminOnly: true,
  },
  {
    label: "Manage Books",
    route: "/manage-books",
    // adminOnly: true,
  },
];

interface Props {
  session: Session | null;
}

function NavBar({ session }: Props) {
  const pathname = usePathname();
  console.log(pathname);

  const [openHamburgerMenu, setOpenHamburgerMenu] = useState(false);

  return (
    <div className="flex justify-between items-center border-b py-4 px-4 lg:px-16 fixed left-0 right-0 top-0 bg-white z-20">
      <Link href="/">
        <h1 className="font-semibold text-sm lg:text-lg">Library</h1>
      </Link>
      <div className="hidden lg:block">
        {session?.user ? (
          <div>
            {navLinks.map((navLink) => {
              if (navLink.adminOnly && session.user.isAdmin != true)
                return null;

              return (
                <Link href={navLink.route} key={navLink.label}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn("text-gray-500 font-normal relative", {
                      "text-black": pathname.includes(navLink.route),
                    })}
                  >
                    {navLink.label}
                    {pathname.includes(navLink.route) && (
                      <Separator className="absolute top-[50px]  bg-black w-[calc(100%-24px)] h-[2px]" />
                    )}
                  </Button>
                  {/* <div className="flex gap-2 items-center cursor-pointer text-xs lg:text-base">
                  <span className="text-base">{navLink.label}</span>
                </div> */}
                </Link>
              );
            })}

            <Button
              size="sm"
              variant="ghost"
              className="text-gray-500 font-normal"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-500 font-normal"
            onClick={() => signIn("google")}
          >
            Login
          </Button>
        )}
      </div>
      <div className="block lg:hidden">
        {session?.user ? (
          <Sheet
            open={openHamburgerMenu}
            onOpenChange={() => setOpenHamburgerMenu(!openHamburgerMenu)}
          >
            <SheetTrigger>
              <RxHamburgerMenu size={20} />
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col">
                {navLinks.map((navLink) => {
                  if (navLink.adminOnly && session.user.isAdmin != true)
                    return null;

                  return (
                    <Link href={navLink.route} key={navLink.label}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-gray-500 font-normal",
                          {
                            "text-black": pathname.includes(navLink.route),
                          }
                        )}
                        onClick={() => setOpenHamburgerMenu(false)}
                      >
                        {navLink.label}
                      </Button>
                    </Link>
                  );
                })}
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start text-gray-500 font-normal"
                  onClick={() => signOut()}
                  text-gray-500
                  font-normal
                >
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-500 font-normal"
            onClick={() => signIn("google")}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
}

export default NavBar;
