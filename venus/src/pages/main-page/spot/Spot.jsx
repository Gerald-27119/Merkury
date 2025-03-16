import { FaLocationDot } from "react-icons/fa6";
import { Rate } from "antd";
import { RiArrowDownSFill } from "react-icons/ri";
import { useState } from "react";
import SpotProfile from "./SpotProfile.jsx";
import { TfiMapAlt } from "react-icons/tfi";

export default function Spot({ spot }) {
  const [isTileExpanded, setIsTileExpanded] = useState(false);
  const handleClickToggleExpandFile = () => {
    setIsTileExpanded((prevState) => !prevState);
  };
  return (
    <div className="w-fit border-2 rounded-2xl my-1">
      <div className="flex space-x-6 mb-2">
        <div className="flex items-center space-x-3 my-2 ml-2">
          <FaLocationDot size={17} className="text-red-500" />
          <h3 className="text-lg">{spot.location}</h3>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer justify-end mr-3.5 w-fit ml-auto">
          <span className="text-lg">See on the map</span>
          <TfiMapAlt size={30} />
        </div>
      </div>
      <div className="flex">
        <img
          src={spot.photos[0]?.img}
          alt={spot.name}
          className={`w-80 h-72 ${!isTileExpanded ? "rounded-bl-2xl" : ""}`}
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
          <button
            onClick={handleClickToggleExpandFile}
            className="flex items-center justify-center border-2 rounded-md w-48 mx-auto mb-3.5 px-1.5 hover:bg-gray-800 hover:border-zinc-600 hover:text-zinc-300"
          >
            {isTileExpanded ? (
              <>
                Hide{" "}
                <RiArrowDownSFill
                  size={35}
                  className={`transform transition duration-500 ${isTileExpanded ? "rotate-180" : ""}`}
                />
              </>
            ) : (
              <>
                Read more{" "}
                <RiArrowDownSFill
                  size={35}
                  className={`transform transition duration-500 ${isTileExpanded ? "rotate-180" : ""}`}
                />
              </>
            )}
          </button>
        </div>
      </div>
      <div
        className={`transition-all duration-500 ${isTileExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
      >
        <SpotProfile photos={spot.photos} comments={spot.comments} />
      </div>
    </div>
  );
}
