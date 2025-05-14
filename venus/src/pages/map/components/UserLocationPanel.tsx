import { MdMyLocation } from "react-icons/md";
import React, { useState } from "react";
import { Marker, useMap } from "@vis.gl/react-maplibre";
import { GrLocationPin } from "react-icons/gr";
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
        data-testid="user-location-btn"
        onClick={handleClick}
        className="dark:bg-violetDarker bg-fifth text-locationMarkerLightBlue hover:bg-lightBgButed dark:text-locationMarkerDarkerBlue hover:dark:bg-violetDark cursor-pointer rounded-full p-3 text-xl drop-shadow-md xl:text-2xl"
      >
        <MdMyLocation />
      </button>
      {cords && (
        <Marker longitude={cords.longitude} latitude={cords.latitude}>
          <div className="relative flex items-center justify-center">
            <div className="absolute bottom-0 h-3 w-3 rounded-full bg-black/35" />
            <GrLocationPin className="text-userLocationPin text-6xl" />
          </div>
        </Marker>
      )}
    </>
  );
}
