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
        if (spots.length > 0) {
            getUserLocation()
                .then(setUserCoords)
                .catch((err) => {
                    dispatch(
                        notificationAction.setInfo({
                            message:
                                "You must turn on location to display how far spots are.",
                        }),
                    );
                });
        }
    }, [spots]);

    return (
        <ul className="grid w-full grid-cols-1 place-items-center gap-8 xl:grid-cols-2 2xl:grid-cols-3">
            {spots.map((spot) => (
                <SpotTile key={spot.id} spot={spot} userCoords={userCoords} />
            ))}
        </ul>
    );
}
