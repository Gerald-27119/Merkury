import ForumCategoryDto from "../../../model/interface/forum/forumCategoryDto";

interface ForumCategoryProps {
    category: ForumCategoryDto;
}

export default function ForumCategory({ category }: ForumCategoryProps) {
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
