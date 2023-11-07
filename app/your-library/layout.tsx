// All the books that you have taken.
// All the books that you have uploaded (admin only)
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { split } from "postcss/lib/list";

interface Props {
  children: React.ReactNode;
}

const tabs = [
  {
    label: "Your books",
    route: "/your-library/your-books",
  },
  {
    label: "Uploaded books",
    route: "/your-library/uploaded-books",
  },
];

export default function Page({ children, ...rest }: Props) {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <div className="min-h-screen flex flex-col p-2 lg:py-8 lg:px-16 mt-16 gap-8">
      <div className="absolute left-0 right-0 border-b pb-1 lg:px-12 text-neutral-600 flex">
        {tabs.map((tab) => (
          <Link href={tab.route} key={tab.label}>
            <Button
              variant={"ghost"}
              className={cn("font-normal relative", {
                "text-black": pathname.includes(tab.route),
              })}
            >
              {tab.label}
              {pathname.includes(tab.route) && (
                <Separator className="absolute top-[42px]  bg-black w-[calc(100%-32px)] h-[2px]" />
              )}
            </Button>
          </Link>
        ))}
      </div>
      <div className="mt-16">{children}</div>
    </div>
  );
}
