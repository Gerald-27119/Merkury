import { ReactNode } from "react";

type SpotCommentVoteDisplayProps = {
    children: ReactNode;
    votes: number;
};

export default function SpotCommentVoteDisplay({
    votes,
    children,
}: SpotCommentVoteDisplayProps) {
    return (
        <div className="flex items-center space-x-1 text-2xl">
            <div className="relative h-6 w-6">{children}</div>
            <p>{votes}</p>
        </div>
    );
}
