import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons";

interface Props {
  selectedCategoryLabel: string | null;
  label: string;
  icon: IconType;
  onClick: (label: string) => void;
}

function CategoryItem({
  selectedCategoryLabel,
  label,
  icon: Icon,
  onClick,
}: Props) {
  return (
    <div
      className={cn(
        "flex gap-2 flex-col items-center text-gray-500 text-xs font-normal cursor-pointer hover:text-black group shrink-0",
        { "text-black": selectedCategoryLabel === label }
      )}
      key={label}
      onClick={() => onClick(label)}
    >
      <Icon size={20} />
      <p>{label}</p>
      <Separator
        className={cn("h-[2px] w-0 group-hover:w-full", {
          "bg-black w-full": selectedCategoryLabel === label,
        })}
      />
    </div>
  );
}

export default CategoryItem;
