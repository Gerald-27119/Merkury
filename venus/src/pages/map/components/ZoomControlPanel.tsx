import { FaPlus, FaMinus } from "react-icons/fa";
import React from "react";
import { useMap } from "@vis.gl/react-maplibre";

const btnClasses: string =
  "cursor-pointer w-full p-4 dark:bg-violetDarker bg-fifth hover:dark:bg-violetDark hover:bg-lightBgButed";
export default function ZoomControlPanel() {
  const { current: map } = useMap();
  const handleZoomIn = () => {
    map?.zoomIn();
  };
  const handleZoomOut = () => {
    map?.zoomOut();
  };

  return (
    <div className="dark:text-darkText text-violetBright absolute right-10 bottom-10 flex flex-col rounded-3xl text-3xl">
      <button
        onClick={handleZoomIn}
        className={`${btnClasses} rounded-t-3xl inset-shadow-xs`}
      >
        <FaPlus />
      </button>
      <div className="dark:bg-violetLight bg-darkBorder h-1 w-full"></div>
      <button
        onClick={handleZoomOut}
        className={`${btnClasses} rounded-b-3xl shadow-md`}
      >
        <FaMinus />
      </button>
    </div>
  );
}
