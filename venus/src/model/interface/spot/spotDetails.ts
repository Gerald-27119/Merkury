import SpotCoordinatesDto from "./coordinates/spotCoordinatesDto";
import SpotMediaDto from "./spotMediaDto";
import TagDto from "../tagDto";

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
    tags: TagDto[];
}
