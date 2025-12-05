export default function SkeletonPostCategoryTag() {
    return (
        <div className="dark:bg-darkBgSoft w-52 rounded-2xl shadow-lg">
            <div className="p-4">
                <div className="mb-1 h-5 w-24 animate-pulse rounded bg-gray-400"></div>

                <div className="mt-2">
                    <div className="mb-2 h-5 w-16 animate-pulse rounded bg-gray-400"></div>
                    <div className="mb-2 h-5 w-16 animate-pulse rounded bg-gray-400"></div>
                    <div className="mb-2 h-5 w-16 animate-pulse rounded bg-gray-400"></div>
                    <div className="mb-2 h-5 w-16 animate-pulse rounded bg-gray-400"></div>
                    <div className="mb-2 h-5 w-16 animate-pulse rounded bg-gray-400"></div>
                    <div className="h-5 w-16 animate-pulse rounded bg-gray-400"></div>
                </div>
            </div>

            <div className="p-4">
                <div className="mb-1 h-5 w-24 animate-pulse rounded bg-gray-400"></div>

                <div className="mt-2 flex flex-wrap gap-2 gap-y-1">
                    <div className="mb-1 h-5 w-12 animate-pulse rounded bg-gray-400"></div>
                    <div className="mb-1 h-5 w-18 animate-pulse rounded bg-gray-400"></div>
                    <div className="mb-1 h-5 w-16 animate-pulse rounded bg-gray-400"></div>
                    <div className="mb-1 h-5 w-14 animate-pulse rounded bg-gray-400"></div>
                </div>
            </div>
        </div>
    );
}
