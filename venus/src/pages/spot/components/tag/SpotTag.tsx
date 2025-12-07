type SpotTagProps = {
    name: string;
    textSizeClass?: string;
};

export default function SpotTag({ name, textSizeClass }: SpotTagProps) {
    return (
        <div
            className={`border-darkText text-violetDark dark:text-darkText bg-whiteBg dark:bg-violetDarker w-fit rounded-lg border px-3.5 py-1 text-center drop-shadow-md dark:drop-shadow-none ${textSizeClass || "text-sm 2xl:text-lg"}`}
        >
            {name}
        </div>
    );
}
