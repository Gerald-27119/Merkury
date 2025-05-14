import { Friend } from "../../../../model/interface/account/friends/friend";
import { BiMessageRounded } from "react-icons/bi";
import { FaUser, FaUserMinus } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  editUserFollowed,
  editUserFriends,
} from "../../../../http/user-dashboard";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import FriendButton from "./FriendButton";
import { EditUserFriendsType } from "../../../../model/enum/account/friends/editUserFriendsType";
import { FriendsListType } from "../../../../model/enum/account/friends/friendsListType";

interface FriendCardProps {
  friend: Friend;
  type: FriendsListType;
}

export default function FriendCard({ friend, type }: FriendCardProps) {
  const username = useSelectorTyped((state) => state.account.username);
  const queryClient = useQueryClient();

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

  const removeUserFriend = async (friendUsername: string) => {
    await mutateAsyncFriends({
      username,
      friendUsername,
      type: EditUserFriendsType.REMOVE,
    });
  };

  const removeUserFollowed = async (followedUsername: string) => {
    await mutateAsyncFollowed({
      username,
      followedUsername,
      type: EditUserFriendsType.REMOVE,
    });
  };

  let handleRemove = async () => {};

  switch (type) {
    case FriendsListType.FOLLOWED:
      handleRemove = () => removeUserFollowed(friend.username);
      break;
    case FriendsListType.FRIENDS:
      handleRemove = () => removeUserFriend(friend.username);
  }

  return (
    <div className="dark:bg-darkBgSoft bg-lightBgSoft space-y-2 rounded-md px-3 pt-3 pb-4">
      <img
        src={friend.profilePhoto}
        alt="profileImage"
        className="mx-6 aspect-square h-56 rounded-full shadow-md"
      />
      <h3 className="text-center text-xl font-semibold capitalize">
        {friend.username}
      </h3>
      <h5 className="text-darkBorder text-center capitalize">available</h5>
      <div className="flex gap-2 text-3xl">
        {/*TODO zrobić działające przyciski*/}
        <FriendButton onClick={() => {}}>
          <FaUser aria-label="userProfileFriendCardIcon" />
        </FriendButton>
        <FriendButton onClick={() => {}}>
          <BiMessageRounded aria-label="messageFriendCardIcon" />
        </FriendButton>
        {type !== FriendsListType.FOLLOWERS && (
          <FriendButton onClick={handleRemove}>
            <FaUserMinus aria-label="userRemoveFriendCardIcon" />
          </FriendButton>
        )}
      </div>
    </div>
  );
}
