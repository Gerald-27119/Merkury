export enum SpotSortType {
    POPULARITY_DESCENDING = "POPULARITY_DESCENDING",
    POPULARITY_ASCENDING = "POPULARITY_ASCENDING",
    RATING_DESCENDING = "RATING_DESCENDING",
    RATING_ASCENDING = "RATING_ASCENDING",
}

export const SpotSortLabels: Record<SpotSortType, string> = {
    [SpotSortType.POPULARITY_DESCENDING]: "Popularity descending",
    [SpotSortType.POPULARITY_ASCENDING]: "Popularity ascending",
    [SpotSortType.RATING_DESCENDING]: "Rating descending",
    [SpotSortType.RATING_ASCENDING]: "Rating ascending",
};
