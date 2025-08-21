interface DetailedPostContentProps {
    title: string;
    content: string;
}

export default function DetailedPostContent({
    title,
    content,
}: DetailedPostContentProps) {
    return (
        <div className="tiptap mt-4 text-lg">
            <span className="text-3xl font-semibold">{title}</span>
            <div
                dangerouslySetInnerHTML={{ __html: content }}
                className="mt-2 break-words whitespace-pre-line"
            ></div>
        </div>
    );
}
