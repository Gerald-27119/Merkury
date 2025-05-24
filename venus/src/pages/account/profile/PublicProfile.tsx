import Profile from "./Profile";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  editUserFollowed,
  editUserFriends,
  getUserPublicProfile,
} from "../../../http/user-dashboard";
import { AxiosError } from "axios";
import { notificationAction } from "../../../redux/notification";
import { EditUserFriendsType } from "../../../model/enum/account/social/editUserFriendsType";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import { useEffect } from "react";
import ProfileButton from "./components/ProfileButton";

const getEditFriendType = (isFriend?: boolean) => {
  return isFriend ? EditUserFriendsType.REMOVE : EditUserFriendsType.ADD;
};

export default function PublicProfile() {
  const dispatch = useDispatchTyped();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { username } = useParams();

  const { data, isLoading } = useQuery({
    queryFn: () => getUserPublicProfile(username!),
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
      type: getEditFriendType(data?.isFriends),
    });
  };

  const handleEditToFollowed = async () => {
    await mutateFollowed({
      followedUsername: username!,
      type: getEditFriendType(data?.isFollowing),
    });
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
    return <div>No profile data available.</div>;
  }

  return (
    <Profile userData={data.profile}>
      <div className="text-darkText flex w-full flex-wrap justify-center gap-5 xl:flex-nowrap">
        <ProfileButton
          onClick={handleEditToFollowed}
          text={data.isFollowing ? "unfollow" : "follow"}
        />
        <ProfileButton
          onClick={handleEditToFriends}
          text={data.isFriends ? "remove from friends" : "add to friends"}
        />
      </div>
    </Profile>
  );
}
