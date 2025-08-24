import { HiDotsHorizontal } from "react-icons/hi";
import { FaBell, FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { MdFlag } from "react-icons/md";
import { useEffect, useRef } from "react";
import MenuItem from "../../components/MenuItem";
import { useToggleState } from "../../../../hooks/useToggleState";
import { useClickOutside } from "../../../../hooks/useClickOutside";
import { useBoolean } from "../../../../hooks/useBoolean";

interface PostMenuProps {
    postId: number;
    isUserAuthor: boolean;
    onDelete: (postId: number) => void;
    onEdit: (postId: number) => void;
    onFollow: (postId: number) => void;
    onReport: (postId: number) => void;
}

export default function PostMenu({
    postId,
    isUserAuthor,
    onDelete,
    onEdit,
    onFollow,
    onReport,
}: PostMenuProps) {
    const [isPostMenuOpen, openPostMenu, closePostMenu] = useBoolean(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useClickOutside(menuRef, closePostMenu, isPostMenuOpen);

    const handleClick = (action: (postId: number) => void) => {
        action(postId);
        closePostMenu();
    };

    return (
        <div className="relative" ref={menuRef}>
            <HiDotsHorizontal
                onClick={isPostMenuOpen ? closePostMenu : openPostMenu}
                className="dark:hover:text-lightBgSoft cursor-pointer text-2xl"
            />

            {isPostMenuOpen && (
                <div className="dark:border-darkBorder dark:bg-darkBgSoft absolute right-0 z-10 mt-2 w-40 rounded-md border bg-white shadow-lg">
                    <ul className="items-center py-1 text-sm">
                        <MenuItem onClick={() => handleClick(onFollow)}>
                            <FaBell />
                            Follow
                        </MenuItem>

                        <MenuItem onClick={() => handleClick(onReport)}>
                            <MdFlag />
                            Report
                        </MenuItem>

                        {isUserAuthor && (
                            <>
                                <MenuItem onClick={() => handleClick(onEdit)}>
                                    <FaEdit />
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={() => handleClick(onDelete)}>
                                    <FaTrashCan />
                                    Delete
                                </MenuItem>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
