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
            className="emoji-picker bg-violetDark/80 w-full min-w-0 grow flex-col rounded-b-xl text-white"
            style={
                {
                    "--sb-thumb": "var(--color-violetLight, #8b5cf6)",
                    "--sb-thumb-hover":
                        "var(--color-violetLightHover, #7c3aed)",
                    "--sb-track":
                        "color-mix(in oklab, var(--color-violetDark, #0b0b3b) 10%, transparent)",
                } as React.CSSProperties
            }
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
                        className="mt-1 mb-3 h-12 w-full rounded-2xl bg-white/10 outline-none focus:ring-2 focus:ring-white"
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
