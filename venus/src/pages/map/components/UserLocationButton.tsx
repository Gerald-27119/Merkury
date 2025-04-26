import { MdMyLocation } from "react-icons/md";
import React from "react";
import maplibregl from "maplibre-gl";

type UserLocationButtonProps = {
  geoRef: React.RefObject<maplibregl.GeolocateControl | null>;
};

export default function UserLocationButton({
  geoRef,
}: UserLocationButtonProps) {
  const handleClick = () => {
    if (geoRef.current) {
      geoRef.current.trigger();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="dark:bg-violetDarker bg-fifth text-locationMarkerLightBlue hover:bg-lightBgButed dark:text-locationMarkerDarkerBlue hover:dark:bg-violetDark absolute right-10 bottom-48 cursor-pointer rounded-full p-4 text-3xl drop-shadow-md"
    >
      <MdMyLocation />
    </button>
  );
}
