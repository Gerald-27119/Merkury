import Profile from "./Profile";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  editUserFollowed,
  editUserFriends,
  getProfileForViewer,
} from "../../../http/user-dashboard";
import { AxiosError } from "axios";
import { notificationAction } from "../../../redux/notification";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import { useEffect, useState } from "react";
import Modal from "../../../components/modal/Modal";
import { useBoolean } from "../../../hooks/useBoolean";
import { SocialListType } from "../../../model/enum/account/social/socialListType";
import { resolveRelationEditType } from "../../../utils/account/profile";
import Button from "../../../components/buttons/Button";

export default function ProfileForViewer() {
  const dispatch = useDispatchTyped();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { username } = useParams();
  const [isModalOpen, openModal, closeModal] = useBoolean(false);
  const [modalAction, setModalAction] = useState<SocialListType | null>(null);

  const { data, isLoading } = useQuery({
    queryFn: () => getProfileForViewer(username!),
    queryKey: ["userProfile", username],
  });

  const { mutateAsync: mutateFriends } = useMutation({
    mutationFn: editUserFriends,
    onError: (e: AxiosError) => {
      if (e.status === 401) {
        dispatch(
          notificationAction.setInfo({
            message: "Please login to add to friends this user.",
          }),
        );
      } else {
        dispatch(notificationAction.setError({ message: e.response?.data }));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["userProfile", username],
      });
    },
  });

  const { mutateAsync: mutateFollowed } = useMutation({
    mutationFn: editUserFollowed,
    onError: (e: AxiosError) => {
      if (e.status === 401) {
        dispatch(
          notificationAction.setInfo({
            message: "Please login to follow this user.",
          }),
        );
      } else {
        dispatch(notificationAction.setError({ message: e.response?.data }));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["userProfile", username],
      });
    },
  });

  const handleEditToFriends = async () => {
    await mutateFriends({
      friendUsername: username!,
      type: resolveRelationEditType(data?.isFriends),
    });
  };

  const handleEditToFollowed = async () => {
    await mutateFollowed({
      followedUsername: username!,
      type: resolveRelationEditType(data?.isFollowing),
    });
  };

  const confirmRemoveFromFriends = () => {
    setModalAction(SocialListType.FRIENDS);
    openModal();
  };

  const confirmRemoveFromFollow = () => {
    setModalAction(SocialListType.FOLLOWED);
    openModal();
  };

  const handleConfirm = async () => {
    if (modalAction === SocialListType.FRIENDS) {
      await handleEditToFriends();
    } else if (modalAction === SocialListType.FOLLOWED) {
      await handleEditToFollowed();
    }
    closeModal();
  };

  useEffect(() => {
    if (data?.isOwnProfile) {
      navigate("/account/profile");
    }
  }, [data?.isOwnProfile, navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data) {
    return (
      <div className="dark:bg-darkBg dark:text-darkText text-lightText bg-lightBg flex h-full w-full items-center justify-center text-2xl">
        <p>No profile data available.</p>
      </div>
    );
  }

  return (
    <>
      <Profile userData={data.profile}>
        <div className="text-darkText flex w-full flex-wrap justify-center gap-5 xl:flex-nowrap">
          <Button
            variant="profile"
            onClick={
              data.isFollowing ? confirmRemoveFromFollow : handleEditToFollowed
            }
            text={data.isFollowing ? "unfollow" : "follow"}
          />
          <Button
            variant="profile"
            onClick={
              data.isFriends ? confirmRemoveFromFriends : handleEditToFriends
            }
            text={data.isFriends ? "remove from friends" : "add to friends"}
          />
        </div>
      </Profile>
      <Modal onClose={closeModal} onClick={handleConfirm} isOpen={isModalOpen}>
        <h2 className="text-xl text-shadow-md">
          {modalAction === SocialListType.FRIENDS
            ? `Are you sure you want to remove ${username} as a friend?`
            : `Are you sure you want to unfollow ${username}?`}
        </h2>
      </Modal>
    </>
  );
}
