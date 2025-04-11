import Img from "../img";
import Comment from "../comment/comment";

export default interface FullSpot {
  id: number;
  areaColor: string;
  name: string;
  description: string;
  rating: number;
  viewsCount: number;
  contourCoordinates: number[][];
  comments: Comment[];
  photos: Img[];
}
