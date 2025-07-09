import { MediaType } from "../../../enum/mediaType";

export default interface SpotCommentMediaDto {
    id: number;
    url: string;
    mediaType: MediaType;
}
