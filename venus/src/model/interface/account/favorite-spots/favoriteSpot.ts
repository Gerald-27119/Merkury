import SpotTagDto from "../../spot/tag/spotTagDto";
import { FavoriteSpotsListType } from "../../../enum/account/favorite-spots/favoriteSpotsListType";
import WeatherApiCallCoords from "../../spot/weather/weatherApiCallCoords";

export interface FavoriteSpot {
  id: number;
  name: string;
  country: string;
  city: string;
  description: string;
  rating: number;
  viewsCount: number;
  imageUrl: string;
  type: FavoriteSpotsListType;
  cords: WeatherApiCallCoords;
  tags: SpotTagDto[];
}
