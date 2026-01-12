export default interface AddSpotCommentDto {
    text: string;
    rating: number;
    mediaFiles: File[];
    spotId: number;
}
