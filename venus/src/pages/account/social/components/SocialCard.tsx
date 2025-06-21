import { SocialDto } from "../../../../model/interface/account/social/socialDto";
import { BiMessageRounded } from "react-icons/bi";
import { FaUser, FaUserMinus } from "react-icons/fa";
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

interface SocialCardProps {
  friend: SocialDto;
  type: SocialListType;
  isSocialForViewer: boolean;
}

export default function SocialCard({
  friend,
  type,
  isSocialForViewer,
}: SocialCardProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
      friendUsername,
      type: UserRelationEditType.REMOVE,
    });
  };

  const removeUserFollowed = async (followedUsername: string) => {
    await mutateAsyncFollowed({
      followedUsername,
      type: UserRelationEditType.REMOVE,
    });
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
        <SocialButton onClick={handleNavigateToUserProfile}>
          <FaUser aria-label="userProfileFriendCardIcon" />
        </SocialButton>
        {/*TODO zrobić działające przyciski*/}
        <SocialButton onClick={() => {}}>
          <BiMessageRounded aria-label="messageFriendCardIcon" />
        </SocialButton>
        {type !== SocialListType.FOLLOWERS && !isSocialForViewer && (
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
