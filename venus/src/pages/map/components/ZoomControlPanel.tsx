import { FaPlus, FaMinus } from "react-icons/fa";
import React from "react";
import { MapRef } from "@vis.gl/react-maplibre";
type ZoomControlPanelProps = {
  mapRef: React.RefObject<MapRef>;
};
const btnClasses: string =
  "cursor-pointer w-full p-4 dark:bg-violetDarker hover:dark:bg-violetDark";
export default function ZoomControlPanel({ mapRef }: ZoomControlPanelProps) {
  const handleZoomIn: void = () => {
    const map = mapRef.current?.getMap();
    if (map) map.zoomIn();
  };
  const handleZoomOut: void = () => {
    const map = mapRef.current?.getMap();
    if (map) map.zoomOut();
  };

  return (
    <div className="dark:text-darkText absolute right-10 bottom-10 flex flex-col text-3xl">
      <button onClick={handleZoomIn} className={`${btnClasses} rounded-t-3xl`}>
        <FaPlus />
      </button>
      <div className="bg-violetLight h-1 w-full"></div>
      <button onClick={handleZoomOut} className={`${btnClasses} rounded-b-3xl`}>
        <FaMinus />
      </button>
    </div>
  );
}
