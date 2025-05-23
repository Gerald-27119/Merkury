import MostPopularImage from "./components/MostPopularImage";
import ProfileStat from "./components/ProfileStat";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  editUserFollowed,
  editUserFriends,
  getUserProfile,
} from "../../../http/user-dashboard";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import { useParams } from "react-router-dom";
import ProfileButton from "./components/ProfileButton";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { notificationAction } from "../../../redux/notification";
import { AxiosError } from "axios";
import { EditUserFriendsType } from "../../../model/enum/account/social/editUserFriendsType";

export default function Profile() {
  const username = useSelectorTyped((state) => state.account.username);
  const dispatch = useDispatchTyped();
  const queryClient = useQueryClient();
  const { id } = useParams();

  let profileUsername = id ?? username;

  const { data, isLoading } = useQuery({
    queryFn: () => getUserProfile(profileUsername),
    queryKey: ["userProfile", profileUsername],
    throwOnError: (e: AxiosError) => {
      dispatch(notificationAction.setError({ message: e.response?.data }));
    },
  });

  const { mutateAsync: mutateFriends } = useMutation({
    mutationFn: editUserFriends,
    throwOnError: (e: AxiosError) => {
      dispatch(notificationAction.setError({ message: e.response?.data }));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["userProfile", profileUsername],
      });
    },
  });

  const { mutateAsync: mutateFollowed } = useMutation({
    mutationFn: editUserFollowed,
    throwOnError: (e: AxiosError) => {
      dispatch(notificationAction.setError({ message: e.response?.data }));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["userProfile", profileUsername],
      });
    },
  });

  const handleAddToFriends = async () => {
    await mutateFriends({
      username,
      friendUsername: id!,
      type: EditUserFriendsType.ADD,
    });
  };

  const handleAddToFollowed = async () => {
    await mutateFollowed({
      username,
      followedUsername: id!,
      type: EditUserFriendsType.ADD,
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dark:bg-darkBg dark:text-darkText text-lightText bg-lightBg flex min-h-full w-full flex-col items-center gap-20 p-6 lg:justify-center xl:p-0">
      <div className="mt-17 flex flex-col items-center gap-7 lg:mt-0 lg:-ml-40 lg:flex-row xl:-ml-42 xl:gap-10 2xl:-ml-80">
        <img
          alt="profileImage"
          src={data?.profilePhoto}
          className="dark:drop-shadow-darkBgMuted aspect-square h-64 rounded-full shadow-md sm:h-80 lg:h-85 xl:h-96 dark:drop-shadow-md"
        />
        <div className="flex flex-col gap-6 lg:mt-18 lg:gap-16">
          <p className="dark:text-shadow-darkBorder text-center text-3xl capitalize text-shadow-md lg:text-start">
            {data?.username}
          </p>
          <div className="flex flex-wrap justify-center gap-10 xl:flex-nowrap">
            <ProfileStat label="Followers" value={data?.followersCount} />
            <ProfileStat label="Followed" value={data?.followedCount} />
            <ProfileStat label="Friends" value={data?.friendsCount} />
            <ProfileStat label="Photos" value={data?.photosCount} />
          </div>
          {id && (
            <div className="text-darkText flex w-full flex-wrap justify-center gap-5 xl:flex-nowrap">
              <ProfileButton
                onClick={handleAddToFollowed}
                text={data?.isFollowing ? "unfollow" : "follow"}
              />
              <ProfileButton
                onClick={handleAddToFriends}
                text="add to friends"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-6">
        <h1 className="dark:text-shadow-darkBorder text-3xl font-semibold capitalize text-shadow-md">
          most popular photos
        </h1>
        <div className="flex flex-wrap justify-center-safe gap-6 lg:flex-nowrap">
          {data?.mostPopularPhotos?.map((image) => (
            <MostPopularImage image={image} key={image.id} />
          ))}
          {data?.mostPopularPhotos?.length === 0 && (
            <p className="text-center text-lg">You haven't added any photos.</p>
          )}
        </div>
      </div>
    </div>
  );
}
