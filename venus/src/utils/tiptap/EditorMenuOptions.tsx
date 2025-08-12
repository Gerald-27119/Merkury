import { Editor } from "@tiptap/react";
import {
    LuUndo2,
    LuRedo2,
    LuBold,
    LuItalic,
    LuUnderline,
    LuAlignLeft,
    LuAlignRight,
    LuAlignCenter,
    LuAlignJustify,
    LuImage,
    LuUpload,
    LuLink,
} from "react-icons/lu";
import { ReactNode } from "react";

interface EditorOptionProps {
    icon: ReactNode;
    onClick: () => void;
    pressed: boolean;
}

interface EditorState {
    isHeading1: boolean;
    isHeading2: boolean;
    isHeading3: boolean;
    isBold: boolean;
    isItalic: boolean;
    isUnderlined: boolean;
    isLeft: boolean;
    isRight: boolean;
    isCenter: boolean;
    isJustify: boolean;
}

export function EditorMenuOptions(
    editor: Editor,
    state: EditorState,
    size: number,
): EditorOptionProps[] {
    return [
        {
            icon: <LuUndo2 size={size} />,
            onClick: () => editor.chain().focus().undo().run(),
            pressed: false,
        },
        {
            icon: <LuRedo2 size={size} />,
            onClick: () => editor.chain().focus().redo().run(),
            pressed: false,
        },
        {
            icon: <LuBold size={size} />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            pressed: state.isBold,
        },
        {
            icon: <LuItalic size={size} />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            pressed: state.isItalic,
        },
        {
            icon: <LuUnderline size={size} />,
            onClick: () => editor.chain().focus().toggleUnderline().run(),
            pressed: state.isUnderlined,
        },
        {
            icon: <LuLink size={size} />,
            onClick: () => {
                const url = window.prompt("Podaj URL:");
                if (url) {
                    editor
                        .chain()
                        .focus()
                        .extendMarkRange("link")
                        .setLink({ href: url })
                        .run();
                }
            },
            pressed: false,
        },
        {
            icon: <LuImage size={size} />,
            onClick: () => {
                const url = window.prompt("Podaj URL obrazka:");
                if (url) {
                    editor
                        .chain()
                        .focus()
                        .setImage({ src: url, alt: "obrazek" })
                        .run();
                }
            },
            pressed: false,
        },
        {
            icon: <LuUpload size={size} />,
            onClick: () => editor.chain().focus(),
            pressed: false,
        },
        {
            icon: <LuAlignLeft size={size} />,
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            pressed: state.isLeft,
        },
        {
            icon: <LuAlignCenter size={size} />,
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            pressed: state.isCenter,
        },
        {
            icon: <LuAlignRight size={size} />,
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            pressed: state.isRight,
        },
        {
            icon: <LuAlignJustify size={size} />,
            onClick: () => editor.chain().focus().setTextAlign("justify").run(),
            pressed: state.isJustify,
        },
    ];
}
