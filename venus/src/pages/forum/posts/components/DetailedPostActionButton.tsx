import React from "react";
import { formatNumber } from "../../../../utils/forum/numberFormatter";

interface DetailedPostActionButtonProps {
    Icon: React.ElementType;
    data: number;
    isActive?: boolean;
    onClick?: () => void;
}

export default function DetailedPostActionButton({
    Icon,
    data,
    onClick,
    isActive,
}: DetailedPostActionButtonProps) {
    return (
        <div className="flex items-center">
            <Icon
                onClick={onClick}
                className={`cursor-pointer hover:text-blue-500 ${isActive ? "text-blue-500" : ""}`}
            />
            <p className="ml-2 w-10 text-lg tabular-nums">
                {formatNumber(data)}
            </p>
        </div>
    );
}
