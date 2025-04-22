import { Image } from "../../../../model/interface/account/profile/image";
import { FaEye, FaHeart } from "react-icons/fa";

interface ImageProps {
  image: Image;
}

export default function MostPopularImage({ image }: Readonly<ImageProps>) {
  return (
    <div className="group relative">
      <img
        className="aspect-square h-64 rounded-md object-cover shadow-md transition duration-300 group-hover:opacity-80"
        src={image.src}
        alt={image.title}
      />
      <div className="absolute bottom-0 left-0 flex w-full justify-center gap-4 rounded-b-md py-2 text-xl transition duration-300 group-hover:bg-black/60">
        <span className="flex items-center gap-2">
          <FaHeart />
          {image.heartsCount}
        </span>
        <span className="flex items-center gap-2">
          <FaEye />
          {image.viewsCount}
        </span>
      </div>
    </div>
  );
}
