import { SPOTS } from "../spots-data.js";
import { Carousel } from "antd";
import { FaLocationDot } from "react-icons/fa6";

export default function SpotCarousel() {
  return (
    <Carousel
      arrows={true}
      autoplay={{ dotDuration: true }}
      className="w-[35rem] h-96 my-10 px-10"
    >
      {SPOTS.map((spot) => (
        <div
          key={spot.id}
          className="relative flex justify-center h-72 w-full text-white border-2 border-white rounded-xl my-10"
        >
          <img
            src={spot.photos[0].img}
            alt={spot.name}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute right-5 bottom-5 text-left text-white bg-black bg-opacity-50 p-3 rounded-lg">
            <div className="flex items-center font-semibold">
              <FaLocationDot size={13} className="text-red-500 mr-2" />
              {spot.location}
            </div>
            <p className="font-semibold">{spot.name}</p>
          </div>
        </div>
      ))}
    </Carousel>
  );
}
