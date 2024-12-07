import { IoSunny } from "react-icons/io5";
import { FiSunset } from "react-icons/fi";
import { FiSunrise } from "react-icons/fi";
import { RiArrowDownWideFill } from "react-icons/ri";
import { useState } from "react";

export default function Weather({ weather }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {weather ? (
        <div className="border border-violet-700 rounded-sm p-1 bg-sky-200">
          <div className="flex items-center justify-between">
            {weather.general === "sunny" && (
              <IoSunny size={40} className="text-yellow-300 ml-3" />
            )}
            <div className="text-xl text-sky-50 right-0 mr-5">
              {weather.temperature}&deg;C
            </div>
          </div>
          {showDetails && (
            <div>
              <div className="flex">
                <FiSunrise />
                {weather.sunrise}
              </div>
              <div className="flex">
                <FiSunset />
                {weather.sunset}
              </div>
            </div>
          )}
          <div
            onClick={() => setShowDetails((prevState) => !prevState)}
            className="w-full mt-1 flex justify-center border border-sky-100 hover:bg-sky-100 cursor-pointer"
          >
            <RiArrowDownWideFill
              size={30}
              className={`transform transition-transform duration-300 ${
                showDetails ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      ) : (
        <div>No weather is available!</div>
      )}
    </>
  );
}
