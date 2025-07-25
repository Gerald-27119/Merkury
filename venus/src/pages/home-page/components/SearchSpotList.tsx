import SearchSpotDto from "../../../model/interface/spot/search-spot/searchSpotDto";
import SpotTile from "./SpotTile";

interface SearchSpotListProps {
    spots: SearchSpotDto[];
}

export default function SearchSpotList({ spots }: SearchSpotListProps) {
    return (
        <ul className="grid w-full grid-cols-2 place-content-center justify-items-center gap-5">
            {spots.map((spot) => (
                <SpotTile key={spot.id} spot={spot} />
            ))}
        </ul>
    );
}
