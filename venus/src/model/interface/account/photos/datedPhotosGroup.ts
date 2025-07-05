import Photo from "./photo";

export default interface DatedPhotosGroup {
    date: string;
    photos: Photo[];
}
