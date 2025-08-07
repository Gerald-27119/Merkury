import SpotCoordinatesDto from "./coordinates/spotCoordinatesDto";

export default interface GeneralSpot {
    id: number;
    areaColor: string;
    name: string;
    rating: number;
    contourCoordinates: number[][];
    area: number;
    centerPoint: SpotCoordinatesDto;
}
