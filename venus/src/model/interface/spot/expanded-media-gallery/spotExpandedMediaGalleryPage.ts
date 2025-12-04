import Pageable from "../../../pageable";
import SpotExpandedGallerySidebarMediaDto from "./spotExpandedGallerySidebarMediaDto";

export default interface SpotExpandedMediaGalleryPage
    extends Pageable<SpotExpandedGallerySidebarMediaDto> {
    test: string;
}
