import SpotTagDto from "../tag/spotTagDto";
import SpotCoordinatesDto from "../coordinates/spotCoordinatesDto";

export default interface SearchSpotDto {
    id: number;
    name: string;
    rating: number;
    ratingCount: number;
    firstPhoto: string;
    centerPoint: SpotCoordinatesDto;
    tags: SpotTagDto[];
}
