import MostPopularImage from "./components/MostPopularImage";
import ProfileStat from "./components/ProfileStat";
import UserProfile from "../../../model/interface/account/profile/userProfile";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { SocialListType } from "../../../model/enum/account/social/socialListType";
import { socialAction } from "../../../redux/social";
import AccountWrapper from "../components/AccountWrapper";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";

interface ProfileProps {
    userData: UserProfile;
    children?: ReactNode;
    username?: string;
}

export default function Profile({
    userData,
    children,
    username,
}: ProfileProps) {
    const navigate = useNavigate();
    const dispatch = useDispatchTyped();

    const handleNavigateToSocial = (type: SocialListType) => {
        dispatch(socialAction.setType(type));
        if (username == undefined) {
            navigate("/account/friends");
        } else {
            navigate(`/account/friends/${username}`);
        }
    };

    return (
        <AccountWrapper variant={AccountWrapperType.PROFILE}>
            <div className="mt-17 flex flex-col items-center gap-7 lg:mt-0 lg:-ml-40 lg:flex-row xl:-ml-42 xl:gap-10 2xl:-ml-80">
                <img
                    alt="profileImage"
                    src={userData?.profilePhoto}
                    className="dark:drop-shadow-darkBgMuted aspect-square h-64 rounded-full shadow-md sm:h-80 lg:h-85 xl:h-96 dark:drop-shadow-md"
                />
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
