export default function GifWindow() {
    return (
        <div className="flex grow flex-col p-1">
            <div className="w-full px-3">
                <input
                    type="text"
                    placeholder="Search GIFs..."
                    className="bg-violetLight/60 w-full rounded-xl p-2"
                />
            </div>
            <div className="scrollbar-track-violetDark scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark mt-4 grid w-full grid-cols-2 gap-3 overflow-y-scroll p-3">
                <div className="h-32 w-full rounded-xl bg-green-700"></div>
                <div className="h-32 w-full rounded-xl bg-green-700"></div>
                <div className="h-32 w-full rounded-xl bg-green-700"></div>
                <div className="h-32 w-full rounded-xl bg-green-700"></div>
                <div className="h-32 w-full rounded-xl bg-green-700"></div>
                <div className="h-32 w-full rounded-xl bg-green-700"></div>
                <div className="h-32 w-full rounded-xl bg-green-700"></div>
                <div className="h-32 w-full rounded-xl bg-green-700"></div>
                <div className="h-32 w-full rounded-xl bg-green-700"></div>
                <div className="h-32 w-full rounded-xl bg-green-700"></div>
                <div className="h-32 w-full rounded-xl bg-green-700"></div>
                <div className="h-32 w-full rounded-xl bg-green-700"></div>
            </div>
        </div>
    );
}
