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
        {
            icon: <LuList size={size} />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            pressed: state.isBulletList,
        },
        {
            icon: <LuListOrdered size={size} />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            pressed: state.isOrderedList,
        },
    ];
}
