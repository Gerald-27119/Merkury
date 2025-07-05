import Img from "../img";
import SpotCommentDto from "./comment/spotCommentDto";

export default interface FullSpot {
    id: number;
    areaColor: string;
    name: string;
    description: string;
    rating: number;
    viewsCount: number;
    contourCoordinates: number[][];
    comments: SpotCommentDto[];
    photos: Img[];
}
