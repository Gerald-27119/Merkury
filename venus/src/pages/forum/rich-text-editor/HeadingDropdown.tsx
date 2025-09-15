import { Editor } from "@tiptap/react";
import {
    LuHeading,
    LuHeading1,
    LuHeading2,
    LuHeading3,
    LuHeading4,
    LuHeading5,
    LuHeading6,
} from "react-icons/lu";
import { useBoolean } from "../../../hooks/useBoolean";
import { useRef } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

interface HeadingDropdownProps {
    editor: Editor | null;
    size: number;
}

export default function HeadingDropdown({
    editor,
    size,
}: HeadingDropdownProps) {
    const [isDropdownOpen, openDropdown, closeDropdown] = useBoolean(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, closeDropdown, isDropdownOpen);

    const levels = [
        { level: 1, icon: <LuHeading1 size={size} /> },
        { level: 2, icon: <LuHeading2 size={size} /> },
        { level: 3, icon: <LuHeading3 size={size} /> },
        { level: 4, icon: <LuHeading4 size={size} /> },
        { level: 5, icon: <LuHeading5 size={size} /> },
        { level: 6, icon: <LuHeading6 size={size} /> },
    ];

    const selectHeading = (level: any) => {
        if (editor?.isActive("heading", { level: level })) {
            editor?.chain().focus().setParagraph().run();
        } else {
            editor?.chain().focus().toggleHeading({ level: level }).run();
        }
        closeDropdown();
    };

    return (
        <div ref={dropdownRef} className="relative inline-block">
            <button
                onClick={isDropdownOpen ? closeDropdown : openDropdown}
                type="button"
                className="dark:hover:bg-darkBgMuted hover:bg-lightBgDarker cursor-pointer rounded p-1"
            >
                <LuHeading size={size} />
            </button>
            {isDropdownOpen && (
                <ul className="dark:bg-darkBgSoft bg-lightBgSoft absolute z-[60] mt-1 rounded ring">
                    {levels.map(({ level, icon }) => (
                        <li
                            key={level}
                            onClick={() => selectHeading(level)}
                            className={`dark:hover:bg-darkBgMuted hover:bg-lightBgDarker mt-1 flex cursor-pointer items-center rounded px-1 ${editor?.isActive("heading", { level }) ? "bg-violet-600" : ""} `}
                        >
                            {icon}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
