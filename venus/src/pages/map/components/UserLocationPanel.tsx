import { MdMyLocation } from "react-icons/md";
import React, { useState } from "react";
import { Marker, useMap } from "@vis.gl/react-maplibre";
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
          <div className="bg-userLocationDot/25 relative flex h-7 w-7 items-center justify-center rounded-full">
            <div className="bg-userLocationDot h-3 w-3 rounded-full ring-2 ring-white" />
          </div>
        </Marker>
      )}
    </>
  );
}
