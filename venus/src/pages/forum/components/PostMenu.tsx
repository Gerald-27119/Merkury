import { HiDotsHorizontal } from "react-icons/hi";
import { FaBell, FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { MdFlag } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import PostGeneral from "../../../model/interface/forum/post/PostGeneral";

interface PostMenuProps {
  post: PostGeneral;
  onDelete: (id: number) => void;
}

export default function PostMenu({ post, onDelete }: PostMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    onDelete(post.id);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <HiDotsHorizontal
        onClick={toggleMenu}
        className="dark:hover:text-lightBgSoft cursor-pointer text-2xl"
      />

      {isOpen && (
        <div className="dark:border-darkBorder dark:bg-darkBgSoft absolute right-0 z-10 mt-2 w-40 rounded-md border bg-white shadow-lg">
          <ul className="items-center py-1 text-sm">
            <li className="dark:hover:bg-darkBgMuted flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100">
              <FaBell />
              Follow
            </li>
            <li className="dark:hover:bg-darkBgMuted flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100">
              <MdFlag />
              Report
            </li>

            {post.isAuthor && (
              <>
                <li className="dark:hover:bg-darkBgMuted flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100">
                  <FaEdit />
                  Edit
                </li>
                <li
                  className="dark:hover:bg-darkBgMuted flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  onClick={handleDelete}
                >
                  <FaTrashCan />
                  Delete
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
