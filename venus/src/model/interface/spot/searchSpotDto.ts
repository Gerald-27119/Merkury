import SpotTagDto from "./tag/spotTagDto";

export default interface SearchSpotDto {
  id: number;
  name: string;
  rating: number;
  ratingCount: number;
  firstPhoto: string;
  centerPoint: number[][];
  tags: SpotTagDto[];
}
