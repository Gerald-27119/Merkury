import Comment from "../../../../model/interface/account/comments/comment";

interface CommentsListProps {
    comments: Comment[];
}

export default function CommentsList({ comments }: CommentsListProps) {
    return (
        <ul className="ml-20 space-y-3">
            {comments.map((c) => (
                <li
                    key={c.id}
                    className="bg-darkBgSoft flex flex-col rounded-md px-2 py-1.5"
                >
                    <p className="text-darkBorder">{c.addTime}</p>
                    <p className="text-lg">{c.text}</p>
                </li>
            ))}
        </ul>
    );
}
