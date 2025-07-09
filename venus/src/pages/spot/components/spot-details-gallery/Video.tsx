import SpotMediaDto from "../../../../model/interface/spot/spotMediaDto";
import { HTMLAttributes } from "react";
import ReactPlayer from "react-player";
import {
    MediaControlBar,
    MediaController,
    MediaFullscreenButton,
    MediaMuteButton,
    MediaPlaybackRateButton,
    MediaPlayButton,
    MediaSeekBackwardButton,
    MediaSeekForwardButton,
    MediaTimeDisplay,
    MediaTimeRange,
    MediaVolumeRange,
} from "media-chrome/dist/react";
import { useBoolean } from "../../../../hooks/useBoolean";

type VideoProps = {
    video: SpotMediaDto;
    shouldPlayVideo: boolean;
} & HTMLAttributes<HTMLDivElement>;

export default function Video({
    video,
    shouldPlayVideo,
    ...props
}: VideoProps) {
    const [isError, setErrorHappened, _, __] = useBoolean();
    return (
        <div {...props} className="max-h-60 overflow-hidden rounded-2xl">
            <MediaController
                style={{
                    aspectRatio: "16/9",
                }}
                className="media-controller h-full w-full"
            >
                <ReactPlayer
                    playing={shouldPlayVideo}
                    slot="media"
                    src={video.url}
                    controls={false}
                    style={{
                        width: "100%",
                        height: "100%",
                        aspectRatio: "16/9",
                        "--controls": "none",
                    }}
                    onError={() => setErrorHappened()}
                />
                {isError && <p>Failed to play this video.</p>}
                <MediaControlBar className="media-control-bar w-full">
                    <MediaPlayButton className="px-2" />
                    <MediaTimeRange className="px-2" />
                    <MediaTimeDisplay showDuration className="px-2" />
                    <MediaSeekBackwardButton seekOffset={2} className="px-2" />
                    <MediaSeekForwardButton seekOffset={2} className="px-2" />
                    <MediaMuteButton className="px-2" />
                    <MediaVolumeRange className="px-2" />
                    <MediaPlaybackRateButton className="px-2" />
                    <MediaFullscreenButton className="px-2" />
                </MediaControlBar>
            </MediaController>
        </div>
    );
}
