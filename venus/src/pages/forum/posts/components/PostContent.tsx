import { MdMessage } from "react-icons/md";
import { HiEye } from "react-icons/hi";

interface PostContentProps {
    content: string;
    views: number;
    numberOfComments: number;
}

export default function PostContent({
    content,
    views,
    numberOfComments,
}: PostContentProps) {
    return (
        <div className="mt-2 flex justify-between">
            <p className="dark:hover:text-lightBgSoft cursor-pointer break-words wrap-anywhere whitespace-pre-line">
                {content}
            </p>

            <div className="ml-8 flex flex-row items-end space-x-2">
                <div className="flex flex-col items-center space-y-3 text-lg">
                    <MdMessage />
                    <HiEye />
                </div>

                <div className="flex flex-col items-center space-y-3 text-lg">
                    <span className="align-middle leading-none">
                        {numberOfComments}
                    </span>
                    <span className="align-middle leading-none">{views}</span>
                </div>
            </div>
        </div>
    );
}
