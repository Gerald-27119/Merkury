import SpotCoordinatesDto from "../../spot/coordinates/spotCoordinatesDto";

export interface SpotToAddDto {
    id: number;
    name: string;
    description: string;
    country: string;
    region: string;
    city: string;
    street: string;
    borderPoints: SpotCoordinatesDto[];
    media: File[];
}
