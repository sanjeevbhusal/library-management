"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

function Search() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleChange = useDebouncedCallback((value: string) => {
    console.log("Searching...", value);
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const searchTerm = searchParams.get("query") || "";

  return (
    <Input
      className=" w-full lg:w-96"
      placeholder="Search Books..."
      defaultValue={searchTerm}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}

export default Search;
