import SpotTagDto from "../../spot/tag/spotTagDto";
import { FavoriteSpotsListType } from "../../../enum/account/favorite-spots/favoriteSpotsListType";
import SpotCoordinatesDto from "../../spot/coordinates/spotCoordinatesDto";

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
    coords: SpotCoordinatesDto;
    tags: SpotTagDto[];
}
