import { BiSolidBell, BiSolidBellOff } from "react-icons/bi";

interface FollowPostButtonProps {
    onClick: (postId: number) => void;
    isFollowed?: boolean;
    postId?: number;
}

export default function FollowPostButton({
    onClick,
    isFollowed,
    postId,
}: FollowPostButtonProps) {
    return (
        <div
            onClick={() => onClick(postId!)}
            className="dark:bg-violetDark bg-violetLight/80 dark:hover:bg-violetDarker hover:bg-violetLight mb-4 flex cursor-pointer items-center gap-1 rounded-full p-2 shadow-lg select-none"
        >
            {isFollowed ? (
                <>
                    <BiSolidBellOff size={20} />
                    <p className="text-base font-bold">Unfollow</p>
                </>
            ) : (
                <>
                    <BiSolidBell size={20} />
                    <p className="text-base font-bold">Follow</p>
                </>
            )}
        </div>
    );
}
