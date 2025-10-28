import { MediaType } from "../../../enum/mediaType";

export default interface SpotExpandedGalleryMediaDto {
    id: number;
    url: string;
    mediaType: MediaType;
    likesNumber: number;
    publishDate: string;
    authorName: string;
    authorProfilePhotoUrl: string;
}
