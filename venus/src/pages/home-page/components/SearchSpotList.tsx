import SpotTile from "./SpotTile";
import HomePageSpotDto from "../../../model/interface/spot/search-spot/homePageSpotDto";

interface SearchSpotListProps {
    spots: HomePageSpotDto[];
}

export default function SearchSpotList({ spots }: SearchSpotListProps) {
    return (
        <ul className="grid w-full grid-cols-1 place-items-center gap-8 xl:grid-cols-2 2xl:grid-cols-3">
            {spots.map((spot) => (
                <SpotTile key={spot.id} spot={spot} />
            ))}
        </ul>
    );
}
