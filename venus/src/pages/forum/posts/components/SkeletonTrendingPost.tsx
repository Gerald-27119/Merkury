export default function SkeletonTrendingPost() {
    return (
        <div className="dark:bg-darkBgSoft bg-lightBgSoft mt-4 inline-block w-full rounded-2xl p-4 break-words shadow-lg">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-400"></div>

            <div className="dark:hover:bg-darkBgMuted hover:bg-lightBgDarker flex cursor-pointer flex-col rounded p-2 select-none">
                <div className="mt-2 items-center gap-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-400"></div>
                    <div className="mt-2 h-4 w-40 animate-pulse rounded bg-gray-400"></div>
                </div>
                <div className="mt-2 h-4 w-20 animate-pulse rounded bg-gray-400"></div>
            </div>

            <div className="dark:hover:bg-darkBgMuted hover:bg-lightBgDarker flex cursor-pointer flex-col rounded p-2 select-none">
                <div className="mt-2 items-center gap-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-400"></div>
                    <div className="mt-2 h-4 w-40 animate-pulse rounded bg-gray-400"></div>
                </div>
                <div className="mt-2 h-4 w-20 animate-pulse rounded bg-gray-400"></div>
            </div>

            <div className="dark:hover:bg-darkBgMuted hover:bg-lightBgDarker flex cursor-pointer flex-col rounded p-2 select-none">
                <div className="mt-2 items-center gap-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-400"></div>
                    <div className="mt-2 h-4 w-40 animate-pulse rounded bg-gray-400"></div>
                </div>
                <div className="mt-2 h-4 w-20 animate-pulse rounded bg-gray-400"></div>
            </div>
        </div>
    );
}
