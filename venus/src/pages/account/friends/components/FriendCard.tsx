import { Friend } from "../../../../model/interface/account/friends/friend";
import { BiMessageRounded } from "react-icons/bi";
import { FaUser, FaUserMinus } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editUserFriends } from "../../../../http/user-dashboard";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import FriendButton from "./FriendButton";
import { EditUserFriendsType } from "../../../../model/enum/editUserFriendsType";

interface FriendCardProps {
  friend: Friend;
}

export default function FriendCard({ friend }: FriendCardProps) {
  const username = useSelectorTyped((state) => state.account.username);
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: editUserFriends,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const removeUserFriend = async (friendUsername: string) => {
    await mutateAsync({
      username,
      friendUsername,
      type: EditUserFriendsType.REMOVE,
    });
  };

  return (
    <div className="dark:bg-darkBgSoft bg-lightBgSoft space-y-2 rounded-md px-3 pt-3 pb-4">
      <img
        src={friend.profilePhoto}
        alt="profile"
        className="mx-6 aspect-square h-56 rounded-full"
      />
      <h3 className="text-center text-xl font-semibold capitalize">
        {friend.username}
      </h3>
      <h5 className="text-darkBorder text-center capitalize">available</h5>
      <div className="flex gap-2 text-3xl">
        {/*TODO zrobić działające przyciski*/}
        <FriendButton onClick={() => {}}>
          <FaUser />
        </FriendButton>
        <FriendButton onClick={() => {}}>
          <BiMessageRounded />
        </FriendButton>
        <FriendButton onClick={() => removeUserFriend(friend.username)}>
          <FaUserMinus />
        </FriendButton>
      </div>
    </div>
  );
}
