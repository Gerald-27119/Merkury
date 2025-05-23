import Img from "../img";
import WeatherApiCallCoords from "./weather/weatherApiCallCoords";
import SpotTagInterface from "./tag/spotTagInterface";

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
  tags: SpotTagInterface[];
}
