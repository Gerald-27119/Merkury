type SpotTagProps = {
    name: string;
    textSizeClass?: string;
};

export default function SpotTag({ name, textSizeClass }: SpotTagProps) {
    return (
        <div
            className={`border-darkText w-fit rounded-lg border px-3.5 py-1 text-center ${textSizeClass || "text-sm 2xl:text-lg"}`}
        >
            {name}
        </div>
    );
}
