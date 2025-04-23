import MostPopularImage from "./components/MostPopularImage";
import ProfileStat from "./components/ProfileStat";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../../http/account";

export default function Profile() {
  const username = useSelectorTyped((state) => state.account.username);

  const { data } = useQuery({
    queryFn: () => getUserProfile(username),
    queryKey: ["userProfile"],
  });

  return (
    <div className="dark:bg-darkBg dark:text-darkText text-lightText bg-lightBg flex h-screen w-full flex-col items-center justify-center-safe gap-20">
      <div className="-ml-80 flex items-center gap-10">
        <img
          alt="profileImage"
          src={data?.profilePhoto}
          className="dark:drop-shadow-darkBgMuted aspect-square h-[472px] rounded-full shadow-md dark:drop-shadow-md"
        />
        <div className="mt-18 flex flex-col gap-16">
          <p className="dark:text-shadow-darkBorder text-3xl capitalize text-shadow-md">
            {data?.username}
          </p>
          <div className="flex gap-10">
            <ProfileStat label="Followers" value={data?.followersCount} />
            <ProfileStat label="Followed" value={data?.followedCount} />
            <ProfileStat label="Friends" value={data?.friendsCount} />
            <ProfileStat label="Photos" value={data?.photosCount} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <h1 className="dark:text-shadow-darkBorder text-3xl font-semibold capitalize text-shadow-md">
          most popular photos
        </h1>
        <div className="flex gap-6">
          {data?.mostPopularPhotos?.map((image) => (
            <MostPopularImage image={image} key={image.title} />
          ))}
          {data?.mostPopularPhotos.length === 0 && (
            <p className="text-center text-lg">You didn't add any photos.</p>
          )}
        </div>
      </div>
    </div>
  );
}
