import { HiDotsHorizontal } from "react-icons/hi";
import { FaBell, FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { MdFlag } from "react-icons/md";
import { useEffect, useRef } from "react";
import MenuItem from "../../components/MenuItem";
import { useToggleState } from "../../../../hooks/useToggleState";

interface PostMenuProps {
    postId: number;
    isUserAuthor: boolean;
    onDelete: (id: number) => void;
}

export default function PostMenu({
    postId,
    isUserAuthor,
    onDelete,
}: PostMenuProps) {
    const [isPostMenuOpen, setIsPostMenuOpen, togglePostMenu] =
        useToggleState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleFollow = () => {};

    const handleReport = () => {};

    const handleEdit = () => {};

    const handleDelete = () => {
        onDelete(postId);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsPostMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <HiDotsHorizontal
                onClick={togglePostMenu}
                className="dark:hover:text-lightBgSoft cursor-pointer text-2xl"
            />

            {isPostMenuOpen && (
                <div className="dark:border-darkBorder dark:bg-darkBgSoft absolute right-0 z-10 mt-2 w-40 rounded-md border bg-white shadow-lg">
                    <ul className="items-center py-1 text-sm">
                        <MenuItem onClick={handleFollow}>
                            <FaBell />
                            Follow
                        </MenuItem>

                        <MenuItem onClick={handleReport}>
                            <MdFlag />
                            Report
                        </MenuItem>

                        {isUserAuthor && (
                            <>
                                <MenuItem onClick={handleEdit}>
                                    <FaEdit />
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={handleDelete}>
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
