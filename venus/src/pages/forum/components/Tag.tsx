interface TagProps {
  tag: String;
}

export default function Tag({ tag }: TagProps) {
  return (
    <span className="dark:text-darkText dark:border-darkBorder border-darkBorder text-lightText cursor-pointer rounded-md border-1 border-solid p-1 text-sm">
      {tag}
    </span>
  );
}
