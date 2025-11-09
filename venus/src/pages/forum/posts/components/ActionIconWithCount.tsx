import React from "react";
import { formatNumber } from "../../../../utils/forum/numberFormatter";

interface ActionIconWithCountProps {
    Icon: React.ElementType;
    data: number;
    isActive?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

export default function ActionIconWithCount({
    Icon,
    data,
    onClick,
    isActive,
    disabled,
}: ActionIconWithCountProps) {
    return (
        <div className="flex items-center">
            <Icon
                onClick={disabled ? undefined : onClick}
                className={` ${disabled ? "cursor-not-allowed text-gray-400" : "cursor-pointer hover:text-blue-400"} ${isActive && !disabled ? "text-blue-400" : ""} `}
            />
            <p className="ml-2 w-10 text-lg tabular-nums select-none">
                {formatNumber(data)}
            </p>
        </div>
    );
}
