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
    <div
      data-testid="zoom-panel"
      className="dark:text-darkText text-violetBright flex flex-col rounded-3xl text-sm lg:text-lg xl:text-xl"
    >
      <button
        onClick={handleZoomIn}
        className={`${btnClasses} rounded-t-full inset-shadow-sm`}
        data-testid="zoom-in-btn"
      >
        <FaPlus />
      </button>
      <div className="dark:bg-violetLight bg-darkBorder h-0.5 w-full"></div>
      <button
        onClick={handleZoomOut}
        className={`${btnClasses} rounded-b-full shadow-lg`}
        data-testid="zoom-out-btn"
      >
        <FaMinus />
      </button>
    </div>
  );
}
