import { AnimatePresence, motion } from "motion/react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BaseLink } from "../../../model/interface/sidebar/link";
import { isSidebarSubmenu } from "../../../utils/sidebar/functions";

interface SidebarLabelProps {
  link: BaseLink;
  isOpen?: boolean;
  isSidebarOpen: boolean;
}

export default function SidebarLabel({
  link,
  isOpen,
  isSidebarOpen,
}: SidebarLabelProps) {
  return (
    <AnimatePresence initial={false}>
      {isSidebarOpen && (
        <div className="relative overflow-hidden">
          <motion.p
            key="sidebar-label"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className={`ml-2 flex min-w-[10rem] items-center text-start font-semibold capitalize`}
          >
            {link.name}
            {isSidebarSubmenu(link) &&
              link.children?.length > 0 &&
              (isOpen ? (
                <IoIosArrowUp className="ml-2" />
              ) : (
                <IoIosArrowDown className="ml-2" />
              ))}
          </motion.p>
        </div>
      )}
    </AnimatePresence>
  );
}
