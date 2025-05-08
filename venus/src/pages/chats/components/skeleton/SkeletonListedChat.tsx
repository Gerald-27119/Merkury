export default function SkeletonListedChat() {
    return (
        <button
            className={
                "hover:bg-violetLight/40 flex w-full items-center gap-4 px-3 py-3 text-left hover:cursor-pointer"
            }
        >
            <div className="aspect-square w-12 animate-pulse rounded-full bg-gray-400"></div>

            <div className="flex w-full flex-col space-y-2">
                <div className="h-6 w-1/3 animate-pulse rounded bg-gray-400"></div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="h-4 w-1/6 animate-pulse rounded bg-gray-400"></div>
                    <div className="h-4 flex-1 animate-pulse rounded bg-gray-400"></div>
                    <div className="ml-auto h-3 w-1/6 animate-pulse rounded bg-gray-400"></div>
                </div>
            </div>
        </button>
    );
}
