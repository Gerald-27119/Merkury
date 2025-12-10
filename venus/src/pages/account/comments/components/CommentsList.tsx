import Comment from "../../../../model/interface/account/comments/comment";

interface CommentsListProps {
    comments: Comment[];
}

export default function CommentsList({ comments }: CommentsListProps) {
    return (
        <ul className="ml-5 space-y-3 md:ml-20">
            {comments.map((c) => (
                <li
                    key={c.id}
                    data-testid="comment"
                    className="dark:bg-darkBgSoft bg-lightBgSoft flex flex-col rounded-md px-2 py-1.5"
                >
                    <p className="dark:text-darkBorder text-lightText/70">
                        {c.addTime}
                    </p>
                    <p className="text-lg">{c.text}</p>
                </li>
            ))}
        </ul>
    );
}
