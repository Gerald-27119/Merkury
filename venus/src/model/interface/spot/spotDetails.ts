import Img from "../img";
import WeatherApiCallCords from "./weather/weatherApiCallCords";

export default interface SpotDetails {
  id: number;
  name: string;
  description: string;
  rating: number;
  viewsCount: number;
  photos: Img[];
  weatherApiCallCords: WeatherApiCallCords;
}
