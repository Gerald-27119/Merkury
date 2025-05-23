import { Social } from "../../../../model/interface/account/social/social";
import { BiMessageRounded } from "react-icons/bi";
import { FaUser, FaUserMinus } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  editUserFollowed,
  editUserFriends,
} from "../../../../http/user-dashboard";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import SocialButton from "./SocialButton";
import { EditUserFriendsType } from "../../../../model/enum/account/social/editUserFriendsType";
import { SocialListType } from "../../../../model/enum/account/social/socialListType";
import { useBoolean } from "../../../../hooks/useBoolean";
import Modal from "../../../../components/modal/Modal";

interface SocialCardProps {
  friend: Social;
  type: SocialListType;
}

export default function SocialCard({ friend, type }: SocialCardProps) {
  const username = useSelectorTyped((state) => state.account.username);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpenToTrue, setIsModalOpenToFalse] =
    useBoolean(false);

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
    case SocialListType.FOLLOWED:
      handleRemove = () => removeUserFollowed(friend.username);
      break;
    case SocialListType.FRIENDS:
      handleRemove = () => removeUserFriend(friend.username);
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
      <h5 className="text-darkBorder text-center capitalize">available</h5>
      <div className="flex gap-2 text-3xl">
        {/*TODO zrobić działające przyciski*/}
        <SocialButton onClick={() => {}}>
          <FaUser aria-label="userProfileFriendCardIcon" />
        </SocialButton>
        <SocialButton onClick={() => {}}>
          <BiMessageRounded aria-label="messageFriendCardIcon" />
        </SocialButton>
        {type !== SocialListType.FOLLOWERS && (
          <SocialButton onClick={setIsModalOpenToTrue}>
            <FaUserMinus aria-label="userRemoveFriendCardIcon" />
          </SocialButton>
        )}
      </div>
      <Modal
        onClose={setIsModalOpenToFalse}
        onClick={handleRemove}
        isOpen={isModalOpen}
      >
        <h2 className="text-xl text-shadow-md">
          Are you sure you want to remove {friend.username} as
          {type === SocialListType.FRIENDS ? " a friend" : " a follower"}?
        </h2>
      </Modal>
    </li>
  );
}
