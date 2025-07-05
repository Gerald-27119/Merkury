import { ReactNode } from "react";

interface MenuItemProps {
    children: ReactNode;
    onClick: () => void;
}

export default function MenuItem({ onClick, children }: MenuItemProps) {
    return (
        <li
            className="dark:hover:bg-darkBgMuted flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100"
            onClick={onClick}
        >
            {children}
        </li>
    );
}
