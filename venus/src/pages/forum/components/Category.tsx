import CategoryDto from "../../../model/interface/forum/categoryDto";

interface CategoryProps {
  category: CategoryDto;
}

export default function Category({ category }: CategoryProps) {
  return (
    <span className="dark:hover:text-lightBgSoft inline-flex cursor-pointer items-center space-x-2 leading-none">
      <span
        className="inline-block h-4 w-1.5 rounded-full"
        style={{ backgroundColor: category.colour }}
      ></span>
      <span>{category.name}</span>
    </span>
  );
}
