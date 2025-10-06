import { FaX } from "react-icons/fa6";
import { useEffect, useRef } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import {
    changeUserFriendsStatus,
    getAllFriendInvites,
} from "../../../../http/user-dashboard";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { FaCheck } from "react-icons/fa";
import { UserFriendStatus } from "../../../../model/enum/account/social/userFriendStatus";
import { useNavigate } from "react-router-dom";

interface FriendInvitesListProps {
    onClose: () => void;
}

export default function FriendInvitesList({ onClose }: FriendInvitesListProps) {
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["friends", "invites"],
            queryFn: ({ pageParam = 0 }) => getAllFriendInvites(pageParam, 10),
            getNextPageParam: (lastPage, allPages) =>
                lastPage.hasNext ? allPages.length : undefined,
            initialPageParam: 0,
        });

    const { mutateAsync } = useMutation({
        mutationFn: changeUserFriendsStatus,
        onSuccess: () => onClose(),
    });

    const handleChangeFriendStatus = async (
        friendUsername: string,
        status: UserFriendStatus,
    ) => {
        await mutateAsync({ friendUsername, status });
    };

    const handleNavigateToUserProfile = (username: string) => {
        navigate(`/account/profile/${username}`);
    };

    const allItems = data?.pages.flatMap((page) => page.items);

    useEffect(() => {
        if (!loadMoreRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 },
        );
        observer.observe(loadMoreRef.current);
        return () => {
            observer.disconnect();
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div className="relative flex flex-col items-center gap-y-6">
            <button
                onClick={onClose}
                className="absolute top-1 right-1 cursor-pointer"
            >
                <FaX className="transform text-2xl duration-300 hover:text-red-600" />
            </button>
            <h1 className="text-center text-2xl font-semibold">Invites</h1>
            {isLoading && <LoadingSpinner />}
            <ul className="flex w-full flex-col gap-y-4">
                {allItems?.length === 0 && (
                    <p>You don't have nay invites yet</p>
                )}
                {allItems?.map((invite) => (
                    <li
                        key={invite.username}
                        className="flex w-full items-center justify-between"
                    >
                        <div className="flex w-full items-center gap-x-3">
                            <button
                                className="cursor-pointer"
                                onClick={() =>
                                    handleNavigateToUserProfile(invite.username)
                                }
                            >
                                <img
                                    src={invite.profilePhoto}
                                    alt="profile"
                                    className="aspect-square h-20 rounded-full"
                                />
                            </button>
                            <h2 className="text-lg capitalize">
                                {invite.username}
                            </h2>
                        </div>
                        <div className="flex gap-x-3">
                            <button
                                onClick={() =>
                                    handleChangeFriendStatus(
                                        invite.username,
                                        UserFriendStatus.ACCEPTED,
                                    )
                                }
                                className="transform cursor-pointer rounded-md bg-green-600 px-3 py-1.5 duration-300 hover:bg-green-700"
                            >
                                <FaCheck />
                            </button>
                            <button
                                onClick={() =>
                                    handleChangeFriendStatus(
                                        invite.username,
                                        UserFriendStatus.REJECTED,
                                    )
                                }
                                className="transform cursor-pointer rounded-md bg-red-600 px-3 py-1.5 duration-300 hover:bg-red-700"
                            >
                                <FaX />
                            </button>
                        </div>
                    </li>
                ))}
                <div ref={loadMoreRef} className="h-10" />
                {isFetchingNextPage && <LoadingSpinner />}
            </ul>
        </div>
    );
}
