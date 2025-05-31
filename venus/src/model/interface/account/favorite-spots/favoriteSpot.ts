import SpotTagDto from "../../spot/tag/spotTagDto";
import { FavoriteSpotsListType } from "../../../enum/account/favorite-spots/favoriteSpotsListType";

export interface FavoriteSpot {
  id: number;
  name: string;
  country: string;
  description: string;
  rating: number;
  viewsCount: number;
  imageUrl: string;
  type: FavoriteSpotsListType;
  tags: SpotTagDto[];
}
