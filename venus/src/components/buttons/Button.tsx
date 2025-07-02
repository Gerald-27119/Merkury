import { ReactNode } from "react";
import { ButtonVariantType } from "../../model/enum/buttonVariantType";

interface ButtonProps {
    onClick: () => void;
    variant: ButtonVariantType;
    className?: string;
    children: ReactNode;
}

const baseClasses =
    "cursor-pointer rounded-md px-2 py-1.5 capitalize shadow-md";
const variantClasses = {
    modal: "text-center",
    profile:
        "dark:bg-violetDark bg-violetLight dark:hover:bg-violetDark/80 hover:bg-violetLight/80 w-full",
    favorite_spot_menu:
        "dark:bg-violetDark dark:hover:bg-violetLight hover:bg-violetDark/87 text-darkText w-full md:w-96 lg:w-full lg:first:mr-15 transform-all duration-300",
    favorite_spot_tile:
        "dark:bg-violetDark bg-violetLight dark:hover:bg-violetLight hover:bg-violetDark/87 text-darkText flex items-center gap-2 w-full lg:w-fit",
};

export default function Button({
    onClick,
    variant,
    className,
    children,
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
