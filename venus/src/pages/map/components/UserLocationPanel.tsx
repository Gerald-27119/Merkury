import { MdMyLocation } from "react-icons/md";
import React, { useState } from "react";
import { Marker, useMap } from "@vis.gl/react-maplibre";
import { GrLocationPin } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { notificationAction } from "../../../redux/notification";
import useDispatchTyped from "../../../hooks/useDispatchTyped";

type Cords = {
  longitude: number;
  latitude: number;
};

export default function UserLocationPanel() {
  const { current: map } = useMap();
  const [cords, setCords] = useState<Cords>();
  const dispatch = useDispatchTyped();

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
        className="dark:bg-violetDarker bg-fifth text-locationMarkerLightBlue hover:bg-lightBgButed dark:text-locationMarkerDarkerBlue hover:dark:bg-violetDark absolute right-2.5 bottom-28 cursor-pointer rounded-full p-3 text-xl drop-shadow-md lg:right-10 lg:bottom-48 lg:p-4 lg:text-3xl xl:right-[1.45rem] xl:bottom-40 xl:text-2xl"
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
