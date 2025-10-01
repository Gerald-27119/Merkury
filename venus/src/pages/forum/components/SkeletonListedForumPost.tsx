export default function SkeletonListedForumPost() {
    return (
        <div className="dark:bg-darkBgSoft mx-auto my-4 max-w-md rounded-xl shadow-md md:max-w-2xl">
            <div className="p-6">
                <div className="mb-4 h-5 w-40 animate-pulse rounded bg-gray-400"></div>

                <div className="mb-4 flex space-x-2">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-400"></div>
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-400"></div>
                </div>

                <div className="mt-2 flex justify-between">
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-full animate-pulse rounded bg-gray-400"></div>
                        <div className="h-4 w-full animate-pulse rounded bg-gray-400"></div>
                        <div className="h-4 w-full animate-pulse rounded bg-gray-400"></div>
                    </div>

                    <div className="ml-8 flex flex-row items-end space-x-2">
                        <div className="flex flex-col items-center space-y-3 text-lg">
                            <div className="h-4 w-8 animate-pulse rounded bg-gray-400"></div>
                            <div className="h-4 w-8 animate-pulse rounded bg-gray-400"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
