import { Dispatch, SetStateAction, useRef } from "react";
import { EmojiPicker } from "@ferrucc-io/emoji-picker";

export default function EmojiWindow({
    setMessageToSend,
}: {
    setMessageToSend: Dispatch<SetStateAction<string>>;
}) {
    const rootRef = useRef<HTMLDivElement>(null);

    function onEmojiSelect(emoji: string) {
        setMessageToSend((prev) => prev + " " + emoji);
    }

    return (
        <div
            ref={rootRef}
            className="emoji-picker dark:bg-violetDark/80 w-full min-w-0 grow flex-col rounded-b-xl dark:text-white bg-whiteBg"
        >
            <EmojiPicker
                className="w-full rounded-b-xl border-none p-2"
                emojisPerRow={12}
                emojiSize={36}
                onEmojiSelect={onEmojiSelect}
            >
                <EmojiPicker.Header className="p-1">
                    <EmojiPicker.Input
                        placeholder="Search emoji"
                        autoFocus={false}
                        hideIcon={true}
                        className="text-md bg-violetLighter/30 mt-1 mb-3 flex h-11 w-full items-start justify-start rounded-2xl text-start outline-none focus:ring-2 focus:ring-white dark:bg-white/10"
                    />
                </EmojiPicker.Header>

                <EmojiPicker.Group className="h-[318px] min-w-0 overflow-y-auto">
                    <EmojiPicker.List
                        hideStickyHeader={true}
                        containerHeight={318}
                    />
                </EmojiPicker.Group>
            </EmojiPicker>
        </div>
    );
}
