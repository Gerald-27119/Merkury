import { useEffect, useState } from "react";
import SearchSpotDto from "../../../model/interface/spot/search-spot/searchSpotDto";
import SpotTile from "./SpotTile";
import { getUserLocation } from "../../../utils/spot-utils";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { notificationAction } from "../../../redux/notification";

interface SearchSpotListProps {
    spots: SearchSpotDto[];
}

export default function SearchSpotList({ spots }: SearchSpotListProps) {
    const dispatch = useDispatchTyped();

    const [userCoords, setUserCoords] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    useEffect(() => {
        getUserLocation()
            .then(setUserCoords)
            .catch((err) => {
                dispatch(
                    notificationAction.setError({
                        message:
                            "You must turn on location to display how far spots are.",
                    }),
                );
            });
    }, []);

    return (
        <ul className="grid w-full grid-cols-2 place-content-center justify-items-center gap-5">
            {spots.map((spot) => (
                <SpotTile key={spot.id} spot={spot} userCoords={userCoords} />
            ))}
        </ul>
    );
}
