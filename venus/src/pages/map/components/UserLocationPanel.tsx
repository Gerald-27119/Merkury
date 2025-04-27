import { MdMyLocation } from "react-icons/md";
import React, { useState } from "react";
import { Marker, useMap } from "@vis.gl/react-maplibre";
import { GrLocationPin } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { notificationAction } from "../../../redux/notification";

type Cords = {
  longitude: number;
  latitude: number;
};

export default function UserLocationPanel() {
  const { current: map } = useMap();
  const [cords, setCords] = useState<Cords>();
  const dispatch = useDispatch();

  const handleClick = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCords({ latitude, longitude });
        map?.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          speed: 1.2,
          curve: 1.42,
          essential: true,
        });
      },
      (error) => {
        dispatch(
          notificationAction.setError({
            message: "Failed to get user localization!",
          }),
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 45000,
      },
    );
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="dark:bg-violetDarker bg-fifth text-locationMarkerLightBlue hover:bg-lightBgButed dark:text-locationMarkerDarkerBlue hover:dark:bg-violetDark absolute right-10 bottom-48 cursor-pointer rounded-full p-4 text-3xl drop-shadow-md"
      >
        <MdMyLocation />
      </button>
      {cords && (
        <Marker longitude={cords.longitude} latitude={cords.latitude}>
          <div className="relative flex items-center justify-center">
            <div className="absolute bottom-0 h-2.5 w-2.5 rounded-full bg-black/35" />
            <GrLocationPin size={40} className="text-userLocationPin" />
          </div>
        </Marker>
      )}
    </>
  );
}
