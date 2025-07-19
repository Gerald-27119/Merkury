import { FaLocationDot } from "react-icons/fa6";
import { TopRatedSpot } from "../../../model/interface/spot/topRatedSpot";

interface MostPopularSpotProps {
    spot: TopRatedSpot;
}

export default function MostPopularSpot({ spot }: MostPopularSpotProps) {
    return (
        <div className="relative w-96">
            <img
                src={spot.imageUrl}
                alt={spot.name}
                className="aspect-video h-full w-full rounded-md"
            />
            <div className="bg-darkBgMuted/60 absolute right-3 bottom-3 flex flex-col rounded-md px-1.5 py-1">
                <span className="flex items-center justify-end space-x-1">
                    <FaLocationDot className="text-red-500" />
                    <p>{spot.city}</p>
                </span>
                <p className="text-xs">{spot.name}</p>
            </div>
        </div>
    );
}
