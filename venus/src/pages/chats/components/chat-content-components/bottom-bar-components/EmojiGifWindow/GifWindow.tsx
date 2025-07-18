export default function GifWindow() {
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="px-3 py-2">
                <input
                    type="text"
                    placeholder="Search GIFs..."
                    className="bg-violetLight w-full rounded-xl p-2"
                />
            </div>
            <div className="bg-violetLightDarker scrollbar-track-violetLightDarker hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-w-1 scrollbar mt-2 grid min-h-0 flex-1 grid-cols-2 gap-3 overflow-auto rounded-b-xl p-3">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-32 w-full rounded-xl bg-green-700"
                    />
                ))}
            </div>
        </div>
    );
}
