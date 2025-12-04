export interface PostSearchRequestDto {
    searchPhrase?: string;
    category?: string;
    tags?: string[];
    fromDate?: string;
    toDate?: string;
    author?: string;
}