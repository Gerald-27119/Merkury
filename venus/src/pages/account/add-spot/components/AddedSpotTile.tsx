import { AddSpotDto } from "../../../../model/interface/account/add-spot/addSpotDto";
import SpotMap from "./SpotMap";

interface AddedSpotTileProps {
    spot: AddSpotDto;
}

export function AddedSpotTile({ spot }: AddedSpotTileProps) {
    return (
        <div className="dark:bg-darkBgSoft bg-lightBgMuted flex h-80 w-full space-x-2 rounded-md shadow-lg dark:shadow-black">
            <img
                alt="spot-image"
                src={spot.firstPhotoUrl}
                className="aspect-square h-full rounded-l-md"
            />
            <div className="w-80 p-1">
                <h1 className="text-lg font-semibold">Location</h1>
                <SpotMap
                    lat={spot.borderPoints[0].x}
                    lng={spot.borderPoints[0].y}
                />
            </div>
            <div className="ml-2 space-y-4 py-2">
                <div>
                    <h2 className="text-lg font-semibold">Name</h2>
                    <p>{spot.name}</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Description</h2>
                    <p>{spot.description}</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Address</h2>
                    <p>
                        {spot.country}, {spot.city}, {spot.street}
                    </p>
                </div>
            </div>
        </div>
    );
}
