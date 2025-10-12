import { SocialDto } from "../../../../model/interface/account/social/socialDto";
import { BiMessageRounded } from "react-icons/bi";
import {
    FaUser,
    FaUserClock,
    FaUserMinus,
    FaUserPlus,
    FaUserTimes,
} from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    editUserFollowed,
    editUserFriends,
} from "../../../../http/user-dashboard";
import SocialButton from "./SocialButton";
import { UserRelationEditType } from "../../../../model/enum/account/social/userRelationEditType";
import { SocialListType } from "../../../../model/enum/account/social/socialListType";
import { useBoolean } from "../../../../hooks/useBoolean";
import Modal from "../../../../components/modal/Modal";
import { useNavigate } from "react-router-dom";
import { chatActions } from "../../../../redux/chats";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { getOrCreatePrivateChat } from "../../../../http/chats";
import { IoAddOutline } from "react-icons/io5";
import { UserFriendStatus } from "../../../../model/enum/account/social/userFriendStatus";
import { useState } from "react";

export const friendStatusIconMap = {
    [UserFriendStatus.ACCEPTED]: <FaUserMinus aria-label="removeFriendIcon" />,
    [UserFriendStatus.PENDING_SENT]: (
        <FaUserClock aria-label="pendingSentIcon" />
    ),
    [UserFriendStatus.PENDING_RECEIVED]: (
        <FaUserClock aria-label="pendingReceivedIcon" />
    ),
    [UserFriendStatus.REJECTED]: <FaUserTimes aria-label="rejectedIcon" />,
    [UserFriendStatus.NONE]: <FaUserPlus aria-label="addFriendIcon" />,
};

interface SocialCardProps {
    friend: SocialDto;
    type: SocialListType;
    isSocialForViewer: boolean;
    isSearchFriend?: boolean;
}

export default function SocialCard({
    friend,
    type,
    isSocialForViewer,
    isSearchFriend,
}: SocialCardProps) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isModalOpen, openModal, closeModal] = useBoolean(false);
    const [isClicked, setIsClicked] = useState(false); // << używamy do disable/grey-out
    const dispatch = useDispatchTyped();
    const isPrivateChatWithThatUserPresent = useSelectorTyped(
        (state) =>
            !!(
                friend.commonPrivateChatId &&
                state.chats.entities[friend.commonPrivateChatId]
            ),
    );

    const { mutateAsync: mutateAsyncFriends } = useMutation({
        mutationFn: editUserFriends,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["friends"] });
        },
    });

    const { mutateAsync: mutateAsyncFollowed } = useMutation({
        mutationFn: editUserFollowed,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["followed"] });
        },
    });

    const { mutateAsync: mutateAsyncGetOrCreatePrivateChat } = useMutation({
        mutationFn: () =>
            getOrCreatePrivateChat(friend.commonPrivateChatId, friend.username),
        onSuccess: (chat) => {
            dispatch(chatActions.upsertChats([chat]));
            dispatch(chatActions.setSelectedChatId(chat.id));
            dispatch(chatActions.clearNew(chat.id));
            navigate("/chat");
        },
    });

    const addUserFriend = async () => {
        await mutateAsyncFriends({
            friendUsername: friend.username,
            type: UserRelationEditType.ADD,
        });
    };

    const removeUserFriend = async (friendUsername: string) => {
        await mutateAsyncFriends({
            friendUsername,
            type: UserRelationEditType.REMOVE,
        });
        closeModal();
    };

    const removeUserFollowed = async (followedUsername: string) => {
        await mutateAsyncFollowed({
            followedUsername,
            type: UserRelationEditType.REMOVE,
        });
        closeModal();
    };

    const handleNavigateToUserProfile = () => {
        navigate(`/account/profile/${friend.username}`);
    };

    let handleRemove = async () => {};

    switch (type) {
        case SocialListType.FOLLOWED:
            handleRemove = () => removeUserFollowed(friend.username);
            break;
        case SocialListType.FRIENDS:
            handleRemove = () => removeUserFriend(friend.username);
    }

    async function handleNavigateToChat() {
        const id = friend.commonPrivateChatId;

        if (id != null && isPrivateChatWithThatUserPresent) {
            dispatch(chatActions.setSelectedChatId(id));
            dispatch(chatActions.clearNew(id));
            navigate("/chat");
            return;
        }
        await mutateAsyncGetOrCreatePrivateChat();
    }

    let icon;

    if (isSearchFriend) {
        icon = friendStatusIconMap[friend.status as UserFriendStatus];
    } else if (friend.isUserFriend) {
        icon = friendStatusIconMap[UserFriendStatus.ACCEPTED];
    } else {
        icon = friendStatusIconMap[UserFriendStatus.NONE];
    }

    function handleAddToPotentialGroupChat() {
        if (isClicked) return;
        dispatch(chatActions.addUserToAddToChat(friend.username));
        setIsClicked(true);
    }

    return (
        <li className="dark:bg-darkBgSoft bg-lightBgSoft space-y-2 rounded-md px-3 pt-3 pb-4">
            <img
                src={friend.profilePhoto}
                alt="profileImage"
                className="mx-6 aspect-square h-56 rounded-full shadow-md"
            />
            <h3 className="text-center text-xl font-semibold capitalize">
                {friend.username}
            </h3>

            {type === SocialListType.POTENTIAL_GROUP_CHAT_MEMBER ? (
                <SocialButton
                    onClick={handleAddToPotentialGroupChat}
                    className="h-12 disabled:cursor-not-allowed disabled:opacity-50 disabled:saturate-0"
                    disabled={isClicked}
                    aria-disabled={isClicked}
                >
                    {isClicked ? (
                        <span className="font-semibol text-base">Dodano</span>
                    ) : (
                        <IoAddOutline
                            aria-label="addToPotentialGroupChatIcon"
                            className="text-4xl"
                        />
                    )}
                </SocialButton>
            ) : (
                <div className="flex gap-2 text-3xl">
                    <SocialButton onClick={handleNavigateToUserProfile}>
                        <FaUser aria-label="userProfileFriendCardIcon" />
                    </SocialButton>
                    <SocialButton onClick={handleNavigateToChat}>
                        <BiMessageRounded aria-label="messageFriendCardIcon" />
                    </SocialButton>
                    {type !== SocialListType.FOLLOWERS &&
                        !isSocialForViewer && (
                            <SocialButton
                                onClick={
                                    friend.isUserFriend
                                        ? openModal
                                        : addUserFriend
                                }
                            >
                                {icon}
                            </SocialButton>
                        )}
                </div>
            )}
            <Modal
                onClose={closeModal}
                onClick={handleRemove}
                isOpen={isModalOpen}
            >
                <h2 className="text-xl text-shadow-md">
                    Are you sure you want to remove {friend.username} as
                    {type === SocialListType.FRIENDS
                        ? " a friend"
                        : " a follower"}
                    ?
                </h2>
            </Modal>
        </li>
    );
}
