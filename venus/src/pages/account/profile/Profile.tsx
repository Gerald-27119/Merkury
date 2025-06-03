import MostPopularImage from "./components/MostPopularImage";
import ProfileStat from "./components/ProfileStat";
import UserProfile from "../../../model/interface/account/profile/userProfile";
import { ReactNode } from "react";

interface ProfileProps {
  userData: UserProfile;
  children?: ReactNode;
}

export default function Profile({ userData, children }: ProfileProps) {
  return (
    <div className="dark:bg-darkBg dark:text-darkText text-lightText bg-lightBg flex min-h-full w-full flex-col items-center gap-20 p-6 lg:justify-center xl:p-0">
      <div className="mt-17 flex flex-col items-center gap-7 lg:mt-0 lg:-ml-40 lg:flex-row xl:-ml-42 xl:gap-10 2xl:-ml-80">
        <img
          alt="profileImage"
          src={userData?.profilePhoto}
          className="dark:drop-shadow-darkBgMuted aspect-square h-64 rounded-full shadow-md sm:h-80 lg:h-85 xl:h-96 dark:drop-shadow-md"
        />
        <div className="flex flex-col gap-6 lg:mt-18 lg:gap-16">
          <p className="dark:text-shadow-darkBorder text-center text-3xl capitalize text-shadow-md lg:text-start">
            {userData?.username}
          </p>
          <div className="flex flex-wrap justify-center gap-10 xl:flex-nowrap">
            <ProfileStat label="Followers" value={userData?.followersCount} />
            <ProfileStat label="Followed" value={userData?.followedCount} />
            <ProfileStat label="Friends" value={userData?.friendsCount} />
            <ProfileStat label="Photos" value={userData?.photosCount} />
          </div>
          {children}
        </div>
      </div>
      <div className="flex flex-col items-center gap-6">
        <h1 className="dark:text-shadow-darkBorder text-3xl font-semibold capitalize text-shadow-md">
          most popular photos
        </h1>
        <div className="flex flex-wrap justify-center-safe gap-6 lg:flex-nowrap">
          {userData?.mostPopularPhotos?.map((image) => (
            <MostPopularImage image={image} key={image.id} />
          ))}
          {userData?.mostPopularPhotos?.length === 0 && (
            <p className="text-center text-lg">You haven't added any photos.</p>
          )}
        </div>
      </div>
    </div>
  );
}
