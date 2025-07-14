import SpotCoordinatesDto from "./coordinates/spotCoordinatesDto";
import SpotTagDto from "./tag/spotTagDto";
import SpotMediaDto from "./spotMediaDto";

export default interface SpotDetails {
    id: number;
    name: string;
    country: string;
    city: string;
    street: string;
    description: string;
    rating: number;
    ratingCount: number;
    media: SpotMediaDto[];
    weatherApiCallCoords: SpotCoordinatesDto;
    tags: SpotTagDto[];
}
