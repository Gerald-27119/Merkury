import ReactPlayer from "react-player";
import {
    MediaControlBar,
    MediaController,
    MediaFullscreenButton,
    MediaMuteButton,
    MediaPlaybackRateButton,
    MediaPlayButton,
    MediaTimeDisplay,
    MediaTimeRange,
    MediaVolumeRange,
} from "media-chrome/dist/react";
import { useBoolean } from "../../../../hooks/useBoolean";
import { FaEye, FaHeart } from "react-icons/fa";
import Media from "../../../../model/interface/account/media/media";

type MovieProps = {
    movie: Media;
};

export default function Movie({ movie }: MovieProps) {
    const [isError, setErrorHappened, _, __] = useBoolean();
    const [isVideoPlaying, ___, stopPlayingVideo, togglePlayingVideo] =
        useBoolean();

    return (
        <li className="group relative">
            <MediaController
                style={{
                    aspectRatio: "16/9",
                }}
                className="media-controller relative h-64 w-full overflow-hidden rounded-2xl drop-shadow-md"
            >
                <ReactPlayer
                    playing={isVideoPlaying}
                    slot="media"
                    src={movie.src}
                    controls={false}
                    muted
                    style={{
                        width: "100%",
                        height: "100%",
                        aspectRatio: "16/9",
                        "--controls": "none",
                    }}
                    onEnded={() => stopPlayingVideo()}
                    onError={() => setErrorHappened()}
                />
                <MediaControlBar
                    className="media-control-bar w-full [&>*]:px-2"
                    style={{ margin: 0 }}
                >
                    <MediaPlayButton onClick={() => togglePlayingVideo()} />
                    <MediaTimeRange />
                    <MediaTimeDisplay showDuration />
                    <MediaMuteButton />
                    <MediaVolumeRange />
                    <MediaPlaybackRateButton />
                    <MediaFullscreenButton />
                </MediaControlBar>
                {isError && (
                    <p className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 p-4 text-center text-sm text-red-400">
                        Failed to load the video. Please try again later.
                    </p>
                )}
            </MediaController>
            <div className="group-hover:bg-lightBg/70 dark:group-hover:bg-darkBg/60 absolute top-0 left-0 flex w-full justify-center gap-4 rounded-b-md py-2 text-xl transition duration-300">
                <span className="flex items-center gap-2">
                    <FaHeart />
                    {movie.heartsCount}
                </span>
                <span className="flex items-center gap-2">
                    <FaEye />
                    {movie.viewsCount}
                </span>
            </div>
        </li>
    );
}
