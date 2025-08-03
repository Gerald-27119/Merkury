import SpotCoordinatesDto from "../coordinates/spotCoordinatesDto";
import SpotTagDto from "../tag/spotTagDto";

export default interface HomePageSpotDto {
    id: number;
    name: string;
    rating: number;
    ratingCount: number;
    firstPhoto: string;
    centerPoint: SpotCoordinatesDto;
    tags: SpotTagDto[];
    city: string;
    distanceToUser: number;
}
