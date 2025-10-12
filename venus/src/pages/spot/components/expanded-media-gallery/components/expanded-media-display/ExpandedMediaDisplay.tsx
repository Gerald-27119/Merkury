import MediaInfoDisplay from "./MediaInfoDisplay";
import { MediaType } from "../../../../../../model/enum/mediaType";
import ExpandedGalleryPhoto from "./ExpandedGalleryPhoto";
import ExpandedGalleryVideo from "./ExpandedGalleryVideo";
import ExpandedGalleryPanel from "./ExpandedGalleryPanel";
import useSelectorTyped from "../../../../../../hooks/useSelectorTyped";

export default function ExpandedMediaDisplay() {
    const currentMedia = useSelectorTyped(
        (state) => state.expandedSpotGalleryCurrentMedia,
    );

    return (
        <div className="flex flex-col items-center">
            <MediaInfoDisplay
                authorName={currentMedia.authorName}
                authorProfilePhotoUrl={currentMedia.authorProfilePhotoUrl}
                publishDate={currentMedia.publishDate}
            />
            <div>
                {currentMedia.mediaType === MediaType.PHOTO ? (
                    <ExpandedGalleryPhoto url={currentMedia.url} />
                ) : (
                    <ExpandedGalleryVideo url={currentMedia.url} />
                )}
            </div>
            <div className="grid w-full grid-cols-3">
                <span className="justify-self-start">totalMediaCount</span>
                <ExpandedGalleryPanel
                    id={currentMedia.id}
                    likes={currentMedia.likesNumber}
                />
                <div></div>
            </div>
        </div>
    );
}
