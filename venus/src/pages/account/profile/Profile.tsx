import MostPopularImage from "./components/MostPopularImage";
import ProfileStat from "./components/ProfileStat";

const images = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    heartsCount: 30,
    viewsCount: 120,
    title: "Mountain Sunrise",
  },
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    heartsCount: 45,
    viewsCount: 300,
    title: "Peaceful Forest",
  },
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    heartsCount: 20,
    viewsCount: 150,
    title: "Lakeside View",
  },
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    heartsCount: 70,
    viewsCount: 540,
    title: "Golden Sunset",
  },
];

export default function Profile() {
  return (
    <div className="dark:bg-darkBg dark:text-darkText flex h-screen w-full flex-col items-center justify-center-safe gap-20">
      <div className="-ml-80 flex items-center gap-10">
        <img
          alt="profileImage"
          src="https://preview.redd.it/apple-cat-v0-8j62im9huxad1.jpeg?width=1080&crop=smart&auto=webp&s=2216680d98bf88d28c752a887b30d1194e15189a"
          className="aspect-square h-[472px] rounded-full"
        />
        <div className="mt-18 flex flex-col gap-16">
          <p className="text-shadow-darkBorder text-3xl text-shadow-md">
            Ludwik Kot
          </p>
          <div className="flex gap-10">
            <ProfileStat label="Followers" value={21} />
            <ProfileStat label="Followed" value={45} />
            <ProfileStat label="Friends" value={37} />
            <ProfileStat label="Photos" value={65} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <h1 className="text-shadow-darkBorder text-3xl font-semibold capitalize text-shadow-md">
          most popular photos
        </h1>
        <div className="flex gap-6">
          {images.map((image) => (
            <MostPopularImage image={image} key={image.title} />
          ))}
        </div>
      </div>
    </div>
  );
}
