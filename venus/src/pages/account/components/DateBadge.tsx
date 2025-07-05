import { ReactNode } from "react";

interface DateBadgeProps {
    date: string;
    children?: ReactNode;
}

export default function DateBadge({ date, children }: DateBadgeProps) {
    return (
        <div className="dark:bg-darkBgMuted bg-lightBgMuted flex w-full space-x-4 rounded-md px-2 py-1.5 text-xl">
            <p className="font-semibold">
                {new Date(date).toLocaleDateString("pl-PL")}
            </p>
            {children}
        </div>
    );
}
