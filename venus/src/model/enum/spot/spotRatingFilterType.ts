export enum SpotRatingFilterType {
    ANY = "ANY",
    TWO = "TWO",
    TWO_HALF = "TWO_HALF",
    THREE = "THREE",
    THREE_HALF = "THREE_HALF",
    FOUR = "FOUR",
    FOUR_HALF = "FOUR_HALF",
}

export const SpotRatingFilterLabels: Record<SpotRatingFilterType, string> = {
    [SpotRatingFilterType.ANY]: "Any rating",
    [SpotRatingFilterType.TWO]: "2.0",
    [SpotRatingFilterType.TWO_HALF]: "2.5",
    [SpotRatingFilterType.THREE]: "3.0",
    [SpotRatingFilterType.THREE_HALF]: "3.5",
    [SpotRatingFilterType.FOUR]: "4.0",
    [SpotRatingFilterType.FOUR_HALF]: "4.5",
};

export const SpotRatingFilterValues: Record<
    SpotRatingFilterType,
    number | null
> = {
    [SpotRatingFilterType.ANY]: null,
    [SpotRatingFilterType.TWO]: 2.0,
    [SpotRatingFilterType.TWO_HALF]: 2.5,
    [SpotRatingFilterType.THREE]: 3.0,
    [SpotRatingFilterType.THREE_HALF]: 3.5,
    [SpotRatingFilterType.FOUR]: 4.0,
    [SpotRatingFilterType.FOUR_HALF]: 4.5,
};
