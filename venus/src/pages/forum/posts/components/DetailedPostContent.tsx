interface DetailedPostContentProps {
    title: string;
    content: string;
}

export default function DetailedPostContent({
    title,
    content,
}: DetailedPostContentProps) {
    return (
        <div className="mt-4 text-lg">
            <span className="font-semibold">{title}</span>
            <p
                dangerouslySetInnerHTML={{ __html: content }}
                className="mt-2 break-words whitespace-pre-line"
            ></p>
        </div>
    );
}
