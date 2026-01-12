import { SpotSortType } from "../../enum/spot/spotSortType";
import { SpotRatingFilterType } from "../../enum/spot/spotRatingFilterType";

export interface SpotSearchRequestDto {
    city?: string;
    tags?: string[];
    sort: SpotSortType;
    filter: SpotRatingFilterType;
    userLongitude?: number;
    userLatitude?: number;
}
