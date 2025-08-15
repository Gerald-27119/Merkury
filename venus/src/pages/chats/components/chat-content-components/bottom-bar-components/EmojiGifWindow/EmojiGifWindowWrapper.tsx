import EmojiWindow from "./EmojiWindow";
import GifWindow from "./GifWindow";
import { Dispatch, SetStateAction } from "react";

export default function EmojiGifWindowWrapper({
    windowName,
    setActiveGifEmojiWindow,
}: {
    windowName: "emoji" | "gif";
    setActiveGifEmojiWindow: Dispatch<SetStateAction<"emoji" | "gif" | null>>;
}) {
    const commonButtonStyle = "px-2 py-2";
    return (
        <div className="bg-violetLightDarker border-violetLighter/35 absolute right-6 bottom-18 z-50 flex h-[26rem] w-[32rem] flex-col rounded-xl border-2">
            <div className="flex w-full items-center justify-center">
                <button className={`${commonButtonStyle} grow text-center`}>
                    GiF
                </button>
                <button className={`${commonButtonStyle} grow text-center`}>
                    Emoji
                </button>
            </div>
            <div className="flex-1 overflow-hidden">
                {windowName === "emoji" ? (
                    <EmojiWindow />
                ) : (
                    <GifWindow
                        setActiveGifEmojiWindow={setActiveGifEmojiWindow}
                    />
                )}
            </div>
        </div>
    );
}
