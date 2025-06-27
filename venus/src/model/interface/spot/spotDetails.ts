import Img from "../img";
import SpotCoordinatesDto from "./coordinates/spotCoordinatesDto";
import SpotTagDto from "./tag/spotTagDto";

export default interface SpotDetails {
  id: number;
  name: string;
  country: string;
  city: string;
  street: string;
  description: string;
  rating: number;
  ratingCount: number;
  photos: Img[];
  weatherApiCallCoords: SpotCoordinatesDto;
  tags: SpotTagDto[];
}
