import { ReactNode } from "react";

type SpotCommentVoteDisplayProps = {
  children: ReactNode;
};

export default function SpotCommentVoteDisplay({
  children,
}: SpotCommentVoteDisplayProps) {
  return <div className="flex items-center space-x-1 text-2xl">{children}</div>;
}
