import CategoryDto from "../../../model/interface/forum/CategoryDto";

interface CategoryProps {
  category: CategoryDto;
}

export default function Category({ category }: CategoryProps) {
  return (
    <span className="flex items-center space-x-2">
      <span
        className={`inline-block h-4 w-1.5 rounded-full ${category.colour}`}
      ></span>
      <span>{category.name}</span>
    </span>
  );
}
