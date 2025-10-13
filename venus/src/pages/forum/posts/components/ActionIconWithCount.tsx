import React from "react";
import { formatNumber } from "../../../../utils/forum/numberFormatter";

interface ActionIconWithCountProps {
    Icon: React.ElementType;
    data: number;
    isActive?: boolean;
    onClick?: () => void;
}

export default function ActionIconWithCount({
    Icon,
    data,
    onClick,
    isActive,
}: ActionIconWithCountProps) {
    return (
        <div className="flex items-center">
            <Icon
                onClick={onClick}
                className={`cursor-pointer hover:text-blue-400 ${isActive ? "text-blue-400" : ""}`}
            />
            <p className="ml-2 w-10 text-lg tabular-nums select-none">
                {formatNumber(data)}
            </p>
        </div>
    );
}
