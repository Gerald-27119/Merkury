type SpotTagProps = {
    name: string;
};

export default function SpotTag({ name }: SpotTagProps) {
    return (
        <div className="border-darkText w-fit rounded-lg border px-3.5 py-1 text-center text-lg">
            {name}
        </div>
    );
}
