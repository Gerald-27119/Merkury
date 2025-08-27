type SelectHeightButtonProps = {
    name: string;
};

export default function SelectHeightButton({ name }: SelectHeightButtonProps) {
    return (
        <button className="bg-warmerWhiteSmoke hover:bg-lightBgMuted w-28 cursor-pointer rounded-md px-4 py-1.5 text-xl shadow-md">
            {name}
        </button>
    );
}
