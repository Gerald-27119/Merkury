import { MediaType } from "../../../enum/mediaType";

export default interface SpotCommentMediaDto {
    id: number;
    idInSpotMedia: number;
    url: string;
    genericMediaType: MediaType;
}
