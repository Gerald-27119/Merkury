import { Editor } from "@tiptap/react";
import { LuHeading, LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
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
                className="cursor-pointer p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                <LuHeading size={size} />
            </button>
            {isDropdownOpen && (
                <ul className="bg-darkBgSoft absolute z-[60] mt-1 rounded ring">
                    {levels.map(({ level, icon }) => (
                        <li
                            key={level}
                            onClick={() => selectHeading(level)}
                            className="mt-1 flex cursor-pointer items-center px-1 hover:bg-red-500"
                        >
                            {icon}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
