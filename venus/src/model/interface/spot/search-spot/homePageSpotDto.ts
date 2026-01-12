import SpotCoordinatesDto from "../coordinates/spotCoordinatesDto";
import TagDto from "../../tagDto";

export default interface HomePageSpotDto {
    id: number;
    name: string;
    rating: number;
    ratingCount: number;
    firstPhoto: string;
    centerPoint: SpotCoordinatesDto;
    tags: TagDto[];
    city: string;
    distanceToUser: number;
}
