export default function SkeletonAllPostTags() {
    const widths = ["w-16", "w-20", "w-24", "w-28"];

    return (
        <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => {
                const randomWidth =
                    widths[Math.floor(Math.random() * widths.length)];

                return (
                    <div
                        key={i}
                        className={`h-6 animate-pulse rounded-xl bg-gray-400 ${randomWidth}`}
                    />
                );
            })}
        </div>
    );
}
