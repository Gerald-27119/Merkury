import Img from "../img";
import WeatherApiCallCoords from "./weather/weatherApiCallCoords";
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
  weatherApiCallCoords: WeatherApiCallCoords;
  tags: SpotTagDto[];
}
