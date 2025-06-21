import Img from "../img";
import SpotComment from "./comment/spotComment";

export default interface FullSpot {
  id: number;
  areaColor: string;
  name: string;
  description: string;
  rating: number;
  viewsCount: number;
  contourCoordinates: number[][];
  comments: SpotComment[];
  photos: Img[];
}
