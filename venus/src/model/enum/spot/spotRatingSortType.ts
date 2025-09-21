export enum SpotRatingSortType {
    ANY = "ANY",
    TWO = "TWO",
    TWO_HALF = "TWO_HALF",
    THREE = "THREE",
    THREE_HALF = "THREE_HALF",
    FOUR = "FOUR",
    FOUR_HALF = "FOUR_HALF",
}

export const SpotRatingSortLabels: Record<SpotRatingSortType, string> = {
    [SpotRatingSortType.ANY]: "Any rating",
    [SpotRatingSortType.TWO]: "2.0",
    [SpotRatingSortType.TWO_HALF]: "2.5",
    [SpotRatingSortType.THREE]: "3.0",
    [SpotRatingSortType.THREE_HALF]: "3.5",
    [SpotRatingSortType.FOUR]: "4.0",
    [SpotRatingSortType.FOUR_HALF]: "4.5",
};

export const SpotRatingSortValues: Record<SpotRatingSortType, number | null> = {
    [SpotRatingSortType.ANY]: null,
    [SpotRatingSortType.TWO]: 2.0,
    [SpotRatingSortType.TWO_HALF]: 2.5,
    [SpotRatingSortType.THREE]: 3.0,
    [SpotRatingSortType.THREE_HALF]: 3.5,
    [SpotRatingSortType.FOUR]: 4.0,
    [SpotRatingSortType.FOUR_HALF]: 4.5,
};
