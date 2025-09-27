import EmojiWindow from "./EmojiWindow";
import GifWindow from "./GifWindow";
import { Dispatch, SetStateAction } from "react";

export default function EmojiGifWindowWrapper({
    windowName,
    setActiveGifEmojiWindow,
    setMessageToSend,
}: {
    windowName: "emoji" | "gif";
    setActiveGifEmojiWindow: Dispatch<SetStateAction<"emoji" | "gif" | null>>;
    setMessageToSend: Dispatch<SetStateAction<string>>;
}) {
    const commonButtonStyle =
        "px-2 py-2 hover:cursor-pointer hover:bg-violetLight";
    const selectedButtonStyle = "bg-violetDarker";

    return (
        <div className="bg-violetLightDarker border-violetLighter/35 absolute right-6 bottom-18 z-50 flex h-[26rem] w-[32rem] flex-col rounded-xl border-2">
            <div className="flex w-full items-center justify-center">
                <button
                    className={`${commonButtonStyle} grow text-center ${windowName === "gif" && selectedButtonStyle} rounded-tl-xl`}
                    onClick={() => setActiveGifEmojiWindow("gif")}
                >
                    GiF
                </button>
                <button
                    className={`${commonButtonStyle} grow text-center ${windowName === "emoji" && selectedButtonStyle} rounded-tr-xl`}
                    onClick={() => setActiveGifEmojiWindow("emoji")}
                >
                    Emoji
                </button>
            </div>
            <div className="flex-1 overflow-hidden">
                {windowName === "emoji" ? (
                    <EmojiWindow setMessageToSend={setMessageToSend} />
                ) : (
                    <GifWindow
                        setActiveGifEmojiWindow={setActiveGifEmojiWindow}
                    />
                )}
            </div>
        </div>
    );
}
