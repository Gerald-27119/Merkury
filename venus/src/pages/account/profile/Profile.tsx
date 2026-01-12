import MostPopularImage from "./components/MostPopularImage";
import ProfileStat from "./components/ProfileStat";
import UserProfile from "../../../model/interface/account/profile/userProfile";
import { ChangeEvent, ReactNode, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { SocialListType } from "../../../model/enum/account/social/socialListType";
import { socialAction } from "../../../redux/social";
import AccountWrapper from "../components/AccountWrapper";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeUserProfilePhoto } from "../../../http/user-dashboard";
import { FaEdit } from "react-icons/fa";
import { notificationAction } from "../../../redux/notification";

interface ProfileProps {
    userData: UserProfile;
    children?: ReactNode;
    username?: string;
    isProfileForViewer?: boolean;
}

export default function Profile({
    userData,
    children,
    username,
    isProfileForViewer,
}: ProfileProps) {
    const navigate = useNavigate();
    const dispatch = useDispatchTyped();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { mutateAsync } = useMutation({
        mutationFn: changeUserProfilePhoto,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            dispatch(
                notificationAction.addSuccess({
                    message: "Your profile photo has been updated.",
                }),
            );
        },
        onError: () => {
            dispatch(
                notificationAction.addError({
                    message:
                        "We couldn’t update your profile photo. Please try again.",
                }),
            );
        },
    });

    const handleNavigateToSocial = (type: SocialListType) => {
        dispatch(socialAction.setType(type));

        let path = "/account/friends";
        if (!username && type === SocialListType.PHOTOS) {
            path = "/account/photos";
        } else if (username) {
            path = `/account/friends/${username}`;
        }

        navigate(path);
    };

    const handleChangeProfilePhoto = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.files?.[0]) {
            await mutateAsync(event.target.files[0]);
        }
    };

    return (
        <AccountWrapper variant={AccountWrapperType.PROFILE}>
            <div className="mt-17 flex flex-col items-center gap-7 lg:mt-0 lg:-ml-40 lg:flex-row xl:-ml-42 xl:gap-10 2xl:-ml-80">
                <div className="relative">
                    <img
                        alt="profileImage"
                        src={userData?.profilePhoto}
                        className="dark:drop-shadow-darkBgMuted aspect-square h-64 rounded-full shadow-md sm:h-80 lg:h-85 xl:h-96 dark:drop-shadow-md"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleChangeProfilePhoto}
                    />
                    {!isProfileForViewer && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 flex cursor-pointer items-center justify-center gap-x-2 rounded-full bg-white/40 text-lg opacity-0 transition hover:opacity-100 dark:bg-black/40"
                        >
                            <FaEdit />
                            <p>Change profile photo.</p>
                        </button>
                    )}
                </div>
                <div className="flex flex-col gap-6 lg:mt-18 lg:gap-16">
                    <p className="text-center text-3xl capitalize lg:text-start">
                        {userData?.username}
                    </p>
                    <div className="flex flex-wrap justify-center gap-10 xl:flex-nowrap">
                        <ProfileStat
                            label="Friends"
                            value={userData?.friendsCount}
                            onClick={() =>
                                handleNavigateToSocial(SocialListType.FRIENDS)
                            }
                        />
                        <ProfileStat
                            label="Followed"
                            value={userData?.followedCount}
                            onClick={() =>
                                handleNavigateToSocial(SocialListType.FOLLOWED)
                            }
                        />
                        <ProfileStat
                            label="Followers"
                            value={userData?.followersCount}
                            onClick={() =>
                                handleNavigateToSocial(SocialListType.FOLLOWERS)
                            }
                        />
                        <ProfileStat
                            label="Photos"
                            value={userData?.photosCount}
                            onClick={() =>
                                handleNavigateToSocial(SocialListType.PHOTOS)
                            }
                        />
                    </div>
                    {children}
                </div>
            </div>
            <div className="flex flex-col items-center gap-6">
                <h1 className="text-3xl font-semibold capitalize">
                    most popular photos
                </h1>
                <div className="flex flex-wrap justify-center-safe gap-6 lg:flex-nowrap">
                    {userData?.mostPopularPhotos?.map((image) => (
                        <MostPopularImage image={image} key={image.id} />
                    ))}
                    {userData?.mostPopularPhotos?.length === 0 && (
                        <p className="text-center text-lg">
                            {username
                                ? "This user hasn't added any photos."
                                : "You haven't added any photos."}
                        </p>
                    )}
                </div>
            </div>
        </AccountWrapper>
    );
}
