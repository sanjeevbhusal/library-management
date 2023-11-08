"use client";

import { CgGhostCharacter } from "react-icons/cg";
import { AiTwotoneHeart } from "react-icons/ai";
import { FaChild } from "react-icons/fa";
import { GiSoapExperiment, GiThink } from "react-icons/gi";
import { LiaUserSecretSolid } from "react-icons/lia";
import { MdOutlineAccountCircle } from "react-icons/md";
import { RiAncientPavilionLine } from "react-icons/ri";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CategoryItem from "./CategoryItem";

const categories = [
  {
    label: "Fiction",
    icon: CgGhostCharacter,
  },
  {
    label: "Romantic",
    icon: AiTwotoneHeart,
  },
  {
    label: "Children",
    icon: FaChild,
  },
  {
    label: "Science Fiction",
    icon: GiSoapExperiment,
  },
  {
    label: "Mystery",
    icon: LiaUserSecretSolid,
  },
  {
    label: "Biography",
    icon: MdOutlineAccountCircle,
  },
  {
    label: "Historical",
    icon: RiAncientPavilionLine,
  },
  {
    label: "Fantasy",
    icon: GiThink,
  },
  // add more categories as needed
];

function CategoryList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function addCategoryToSearchParams(category: string) {
    const params = new URLSearchParams(searchParams);
    params.set("category", category);
    router.push(`${pathname}?${params.toString()}`);
  }

  const selectedCategory = searchParams.get("category");

  return (
    <div className="flex gap-12 justify-between overflow-y-auto scroll">
      {categories.map((category) => {
        const Icon = category.icon;

        return (
          <CategoryItem
            selectedCategoryLabel={selectedCategory}
            label={category.label}
            icon={category.icon}
            onClick={addCategoryToSearchParams}
            key={category.label}
          />
        );
      })}
    </div>
  );
}

export default CategoryList;
