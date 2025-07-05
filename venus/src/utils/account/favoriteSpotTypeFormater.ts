import { FavoriteSpotsListType } from "../../model/enum/account/favorite-spots/favoriteSpotsListType";

export const formatSpotType = (type: FavoriteSpotsListType) => {
    return type
        .toLowerCase()
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};
