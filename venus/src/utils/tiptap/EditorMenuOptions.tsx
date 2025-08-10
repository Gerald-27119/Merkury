import { Editor } from "@tiptap/react";
import {
    MdFormatBold,
    MdFormatItalic,
    MdFormatUnderlined,
} from "react-icons/md";
import {
    LuHeading,
    LuHeading1,
    LuHeading2,
    LuHeading3,
    LuUndo2,
    LuRedo2,
    LuAlignLeft,
    LuAlignRight,
    LuAlignCenter,
    LuAlignJustify,
    LuImage,
    LuUpload,
    LuLink,
    LuHighlighter,
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
    isHighlighted: boolean;
}

export function EditorMenuOptions(
    editor: Editor,
    state: EditorState,
): EditorOptionProps[] {
    return [
        {
            icon: <LuUndo2 />,
            onClick: () => editor.chain().focus().undo().run(),
            pressed: false,
        },
        {
            icon: <LuRedo2 />,
            onClick: () => editor.chain().focus().redo().run(),
            pressed: false,
        },
        {
            icon: <LuHeading1 />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
            pressed: state.isHeading1,
        },
        {
            icon: <MdFormatBold />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            pressed: state.isBold,
        },
        {
            icon: <MdFormatItalic />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            pressed: state.isItalic,
        },
        {
            icon: <MdFormatUnderlined />,
            onClick: () => editor.chain().focus().toggleUnderline().run(),
            pressed: state.isUnderlined,
        },
        {
            icon: <LuLink />,
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
            icon: <LuImage />,
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
            icon: <LuUpload />,
            onClick: () => editor.chain().focus(),
            pressed: false,
        },
        {
            icon: <LuAlignLeft />,
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            pressed: state.isLeft,
        },
        {
            icon: <LuAlignCenter />,
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            pressed: state.isCenter,
        },
        {
            icon: <LuAlignRight />,
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            pressed: state.isRight,
        },
        {
            icon: <LuAlignJustify />,
            onClick: () => editor.chain().focus().setTextAlign("justify").run(),
            pressed: state.isJustify,
        },
        {
            icon: <LuHighlighter />,
            onClick: () =>
                editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: "#835ace" })
                    .run(),
            pressed: state.isHighlighted,
        },
    ];
}
