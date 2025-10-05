export default function SkeletonDetailedPost() {
    return (
        <div className="dark:bg-darkBgSoft mx-auto mb-4 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 animate-pulse rounded-full bg-gray-400"></div>
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-400"></div>
                </div>
                <div className="h-4 w-20 animate-pulse rounded bg-gray-400"></div>
            </div>

            <div className="my-4 flex space-x-2">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-400"></div>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-400"></div>
            </div>

            <div className="mb-4 h-5 w-44 animate-pulse rounded bg-gray-400"></div>

            <div className="flex-1 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-400"></div>
                <div className="h-4 w-1/4 animate-pulse rounded bg-gray-400"></div>
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-400"></div>
                <div className="h-4 w-2/4 animate-pulse rounded bg-gray-400"></div>
            </div>
        </div>
    );
}
