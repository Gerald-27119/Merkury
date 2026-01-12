import { ReactNode } from "react";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";

interface AccountWrapperProps {
    children: ReactNode;
    variant: AccountWrapperType;
}

const baseClasses =
    "dark:bg-darkBg bg-lightBg dark:text-darkText text-lightText w-full flex flex-col";

const socialCommentsSettingsAddSpot = "h-full space-y-8 p-10 pt-17 xl:pt-10";

const variantClasses = {
    photos: "min-h-full space-y-8 p-2 pt-20 md:p-10 md:pt-20 xl:pt-10",
    profile: "min-h-full items-center gap-20 p-6 lg:justify-center xl:p-0",
    favorite_spots: "h-full space-y-10 p-10 pt-17",
    social: socialCommentsSettingsAddSpot,
    comments: socialCommentsSettingsAddSpot,
    settings: socialCommentsSettingsAddSpot,
    movies: "min-h-full space-y-8 p-2 pt-20 md:p-10 md:pt-20 xl:pt-10",
    add_spot: socialCommentsSettingsAddSpot,
};

export default function AccountWrapper({
    children,
    variant,
}: AccountWrapperProps) {
    return (
        <div className={`${baseClasses} ${variantClasses[variant]}`}>
            {children}
        </div>
    );
}
