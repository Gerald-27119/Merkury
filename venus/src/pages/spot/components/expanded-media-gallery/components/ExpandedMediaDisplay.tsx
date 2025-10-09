import SpotExpandedGalleryMediaDto from "../../../../../model/interface/spot/expanded-media-gallery/spotExpandedGalleryMediaDto";
import MediaInfoDisplay from "./MediaInfoDisplay";
import { MediaType } from "../../../../../model/enum/mediaType";
import ExpandedGalleryPhoto from "./ExpandedGalleryPhoto";
import ExpandedGalleryVideo from "./ExpandedGalleryVideo";
import ExpandedGalleryPanel from "./ExpandedGalleryPanel";

type ExpandedMediaDisplayProps = {
    media: SpotExpandedGalleryMediaDto;
    totalMedia: number;
};

export default function ExpandedMediaDisplay({
    media,
    totalMedia,
}: ExpandedMediaDisplayProps) {
    return (
        <div>
            <MediaInfoDisplay
                authorName={media.authorName}
                authorProfilePhotoUrl={media.authorProfilePhotoUrl}
                publishDate={media.publishDate}
            />
            <div>
                {media.mediaType === MediaType.PHOTO ? (
                    <ExpandedGalleryPhoto url={media.url} />
                ) : (
                    <ExpandedGalleryVideo url={media.url} />
                )}
            </div>
            <div>
                <span>{totalMedia}</span>
                <ExpandedGalleryPanel id={media.id} likes={media.likesNumber} />
            </div>
        </div>
    );
}
