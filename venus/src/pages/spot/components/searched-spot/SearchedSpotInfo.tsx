import SearchSpotDto from "../../../../model/interface/spot/searchSpotDto";
import { Rate } from "antd";
import SpotTag from "../tag/SpotTag";
import { useMap } from "@vis.gl/react-maplibre";
import SpotCoordinatesDto from "../../../../model/interface/spot/coordinates/spotCoordinatesDto";

type SearchedSpotInfoProps = {
    spot: SearchSpotDto;
};

export default function SearchedSpotInfo({ spot }: SearchedSpotInfoProps) {
    const { current: map } = useMap();

    const handleClickSpot = (coordinates: SpotCoordinatesDto) => {
        map?.flyTo({
            center: [coordinates.y, coordinates.x],
            zoom: 15,
            speed: 1.2,
            curve: 1.42,
            essential: true,
        });
    };
    return (
        <div
            className="dark:bg-darkBgSoft dark:hover:bg-darkBg flex cursor-pointer rounded-2xl"
            onClick={() => handleClickSpot(spot.centerPoint)}
        >
            <img
                src={spot.firstPhoto}
                alt={`${spot.name}Img`}
                className="aspect-square w-44 rounded-l-2xl"
            />
            <div className="ml-4 flex flex-col items-start space-y-2.5">
                <h3 className="mt-3 mr-1 text-xl font-semibold">{spot.name}</h3>
                <div className="flex items-center">
                    <div className="custom-rate-searched-spot text-ratingStarColor inline-flex min-w-fit">
                        <Rate
                            data-testid="searched-spot-rating"
                            disabled
                            allowHalf
                            value={spot.rating}
                        />
                    </div>
                    <p className="ml-1.5 text-base font-semibold">
                        ({spot.ratingCount})
                    </p>
                </div>
                <ul className="mt-2 flex flex-wrap space-x-3">
                    {spot?.tags?.map((tag) => (
                        <li key={tag.id} className="mb-2">
                            <SpotTag name={tag.name} textSizeClass="text-sm" />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
