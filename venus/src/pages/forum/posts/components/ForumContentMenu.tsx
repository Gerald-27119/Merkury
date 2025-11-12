import { HiDotsHorizontal } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import { BiSolidBell, BiSolidBellOff } from "react-icons/bi";
import { FaTrashCan } from "react-icons/fa6";
import { MdFlag } from "react-icons/md";
import { useRef } from "react";
import MenuItem from "../../components/MenuItem";
import { useClickOutside } from "../../../../hooks/useClickOutside";
import { useBoolean } from "../../../../hooks/useBoolean";

interface ForumContentMenuProps {
    contentId: number;
    isUserAuthor: boolean;
    isContentDeleted?: boolean;
    isFollowed?: boolean;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
    onFollow?: (id: number) => void;
    onReport: (id: number) => void;
}

export default function ForumContentMenu({
    contentId,
    isUserAuthor,
    isContentDeleted = false,
    isFollowed,
    onDelete,
    onEdit,
    onFollow,
    onReport,
}: ForumContentMenuProps) {
    const [isMenuOpen, openMenu, closeMenu] = useBoolean(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useClickOutside(menuRef, closeMenu, isMenuOpen);

    const handleClick = (action: (id: number) => void) => {
        action(contentId);
        closeMenu();
    };

    return (
        <div className="relative" ref={menuRef}>
            {!isContentDeleted && (
                <HiDotsHorizontal
                    onClick={isMenuOpen ? closeMenu : openMenu}
                    className="cursor-pointer text-2xl hover:text-blue-500 dark:hover:text-blue-400"
                />
            )}

            {isMenuOpen && (
                <div className="dark:border-darkBorder dark:bg-darkBgSoft absolute right-0 z-10 mt-2 w-40 rounded-md border bg-white shadow-lg">
                    <ul className="items-center py-1 text-sm">
                        {onFollow && !isUserAuthor && (
                            <MenuItem onClick={() => handleClick(onFollow)}>
                                {isFollowed ? (
                                    <>
                                        <BiSolidBellOff /> Unfollow
                                    </>
                                ) : (
                                    <>
                                        <BiSolidBell /> Follow
                                    </>
                                )}
                            </MenuItem>
                        )}

                        {!isUserAuthor && (
                            <MenuItem onClick={() => handleClick(onReport)}>
                                <MdFlag />
                                Report
                            </MenuItem>
                        )}

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
