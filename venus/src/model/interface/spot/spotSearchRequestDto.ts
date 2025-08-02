import SpotTagDto from "./tag/spotTagDto";

export interface SpotSearchRequestDto {
    city: string;
    tags: SpotTagDto[];
}
