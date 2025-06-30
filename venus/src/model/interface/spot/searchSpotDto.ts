import SpotTagDto from "./tag/spotTagDto";
import BorderPoint from "./borderPoint";

export default interface SearchSpotDto {
  id: number;
  name: string;
  rating: number;
  ratingCount: number;
  firstPhoto: string;
  centerPoint: BorderPoint;
  tags: SpotTagDto[];
}
