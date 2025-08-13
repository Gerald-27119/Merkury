import { Editor } from "@tiptap/react";
import {
    LuUndo2,
    LuRedo2,
    LuList,
    LuListOrdered,
    LuBold,
    LuItalic,
    LuUnderline,
    LuAlignLeft,
    LuAlignRight,
    LuAlignCenter,
    LuAlignJustify,
} from "react-icons/lu";
import { ReactNode } from "react";

interface EditorOptionProps {
    id: string;
    icon: ReactNode;
    onClick: () => void;
    pressed: boolean;
}

interface EditorState {
    isBulletList: boolean;
    isOrderedList: boolean;
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
            id: "undo",
            icon: <LuUndo2 size={size} />,
            onClick: () => editor.chain().focus().undo().run(),
            pressed: false,
        },
        {
            id: "redo",
            icon: <LuRedo2 size={size} />,
            onClick: () => editor.chain().focus().redo().run(),
            pressed: false,
        },
        {
            id: "bold",
            icon: <LuBold size={size} />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            pressed: state.isBold,
        },
        {
            id: "italic",
            icon: <LuItalic size={size} />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            pressed: state.isItalic,
        },
        {
            id: "underline",
            icon: <LuUnderline size={size} />,
            onClick: () => editor.chain().focus().toggleUnderline().run(),
            pressed: state.isUnderlined,
        },
        {
            id: "align-left",
            icon: <LuAlignLeft size={size} />,
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            pressed: state.isLeft,
        },
        {
            id: "align-center",
            icon: <LuAlignCenter size={size} />,
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            pressed: state.isCenter,
        },
        {
            id: "align-right",
            icon: <LuAlignRight size={size} />,
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            pressed: state.isRight,
        },
        {
            id: "align-justify",
            icon: <LuAlignJustify size={size} />,
            onClick: () => editor.chain().focus().setTextAlign("justify").run(),
            pressed: state.isJustify,
        },
        {
            id: "bullet-list",
            icon: <LuList size={size} />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            pressed: state.isBulletList,
        },
        {
            id: "ordered-list",
            icon: <LuListOrdered size={size} />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            pressed: state.isOrderedList,
        },
    ];
}
