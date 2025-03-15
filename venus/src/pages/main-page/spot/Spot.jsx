import { FaLocationDot } from "react-icons/fa6";
import { Rate } from "antd";
import { RiArrowDownSFill } from "react-icons/ri";

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
        <div className="h-72 flex-col flex justify-between">
          <div className="flex pr-6">
            <div className="flex-col ml-4">
              <div className="custom-rate">
                <Rate disabled allowHalf value={spot.rating} />
              </div>
              <h2 className="text-xl max-w-36">{spot.name}</h2>
              <span className="block w-72">{spot.description}</span>
            </div>
            <ul className="list-disc text-left ml-4">
              <h3 className="text-lg">Tags:</h3>
              {spot.categories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </div>
          <button className="flex items-center border-2 rounded-md w-fit mx-auto mb-3.5 px-1.5 hover:bg-gray-800 hover:border-zinc-600 hover:text-zinc-300">
            Read more <RiArrowDownSFill size={35} />
          </button>
        </div>
      </div>
    </div>
  );
}
