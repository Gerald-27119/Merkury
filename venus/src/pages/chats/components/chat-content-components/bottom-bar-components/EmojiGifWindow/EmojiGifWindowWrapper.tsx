import EmojiWindow from "./EmojiWindow";
import GifWindow from "./GifWindow";

export default function EmojiGifWindowWrapper({
    windowName,
}: {
    windowName: "emoji" | "gif";
}) {
    return (
        <div className="absolute right-6 bottom-18 z-20 h-72 w-80 rounded-xl bg-amber-600">
            {windowName === "emoji" ? <EmojiWindow /> : <GifWindow />}
        </div>
    );
}
