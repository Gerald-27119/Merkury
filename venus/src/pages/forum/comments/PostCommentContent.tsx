interface ForumCommentContentProps {
    content: string;
}

export default function PostCommentContent({
    content,
}: ForumCommentContentProps) {
    return (
        <div className="tiptap mt-4 text-lg">
            <div
                dangerouslySetInnerHTML={{ __html: content }}
                className="mt-2 break-words whitespace-pre-line"
            ></div>
        </div>
    );
}
