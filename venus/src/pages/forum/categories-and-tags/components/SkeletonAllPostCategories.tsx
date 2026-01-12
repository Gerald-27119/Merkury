export default function SkeletonAllPostCategories() {
    return (
        <div className="dark:bg-darkBgSoft bg-lightBgSoft dark:hover:bg-darkBgMuted hover:bg-lightBgDarker mb-4 flex cursor-pointer flex-col gap-1 rounded-xl p-4">
            <div className="h-4 w-38 animate-pulse rounded bg-gray-400"></div>
            <div className="mt-2 h-4 w-44 animate-pulse rounded bg-gray-400"></div>
        </div>
    );
}
