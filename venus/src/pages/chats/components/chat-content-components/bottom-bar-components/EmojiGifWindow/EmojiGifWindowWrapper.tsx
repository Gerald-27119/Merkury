import EmojiWindow from "./EmojiWindow";
import GifWindow from "./GifWindow";

export default function EmojiGifWindowWrapper({
    windowName,
}: {
    windowName: "emoji" | "gif";
}) {
    const commonButtonStyle = "px-2 py-2";
    return (
        <div className="bg-violetLightDarker border-violetLight absolute right-6 bottom-18 z-50 flex h-[26rem] w-[32rem] flex-col rounded-xl border">
            <div className="flex w-full items-center justify-center">
                <button className={`${commonButtonStyle} grow text-center`}>
                    GiF
                </button>
                <button className={`${commonButtonStyle} grow text-center`}>
                    Emoji
                </button>
            </div>
            <div className="flex-1 overflow-hidden">
                {windowName === "emoji" ? <EmojiWindow /> : <GifWindow />}
            </div>
        </div>
    );
}
