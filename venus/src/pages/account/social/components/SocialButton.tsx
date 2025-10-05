import { ReactElement } from "react";

interface SocialButtonProps {
    children: ReactElement;
    onClick: () => void;
    isActive?: boolean;
    isWidthFit?: boolean;
    className?: string;
}

export default function SocialButton({
    children,
    onClick,
    isActive,
    isWidthFit,
    className,
}: SocialButtonProps) {
    return (
        <button
            className={`dark:bg-violetDark dark:hover:bg-violetLight bg-violetLight hover:bg-violetLighter text-darkText flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 transition-all duration-300 ${isActive && "dark:bg-violetLight bg-violetLighter"} ${isWidthFit ? "w-fit" : "w-full"} ${className}`}
            onClick={onClick}
            type="button"
        >
            {children}
        </button>
    );
}
