import Img from "../img";
import WeatherApiCallCoords from "./weather/weatherApiCallCoords";

export default interface SpotDetails {
  id: number;
  name: string;
  description: string;
  rating: number;
  viewsCount: number;
  photos: Img[];
  weatherApiCallCoords: WeatherApiCallCoords;
}
