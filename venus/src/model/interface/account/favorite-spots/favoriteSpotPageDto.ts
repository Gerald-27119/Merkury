import { FavoriteSpot } from "./favoriteSpot";

export interface FavoriteSpotPageDto {
    items: FavoriteSpot[];
    hasNext: boolean;
}
