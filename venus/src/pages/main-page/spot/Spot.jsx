import { FaLocationDot } from "react-icons/fa6";
import { Rate } from "antd";

export default function Spot({ spot }) {
  return (
    <div className="w-fit border-2 rounded-2xl my-1">
      <div className="flex items-center space-x-3 my-2 ml-2">
        <FaLocationDot size={17} className="text-red-500" />
        <h3 className="text-lg">{spot.location}</h3>
      </div>
      <div className="flex">
        <img
          src={spot.photos[0]?.url}
          alt={spot.name}
          className="w-80 h-72 rounded-bl-2xl"
        />
        <div className="flex-col ml-4">
          <div className="custom-rate">
            <Rate disabled allowHalf value={spot.rating} />
          </div>
          <h2 className="text-xl max-w-36">{spot.name}</h2>
          <span className="block w-72">{spot.description}</span>
        </div>
      </div>
    </div>
  );
}
