import { ReactNode } from "react";

type SpotActionButtonProps = {
    onClickHandler: () => void;
    children: ReactNode;
};

export default function SpotActionButton({
    onClickHandler,
    children,
}: SpotActionButtonProps) {
    return (
        <button
            onClick={onClickHandler}
            className="dark:ring-darbVioletBtnOutline/50 ring-violetDark/50 dark:hover:bg-violetLight dark:bg-violetDarker hover:bg-whiteSmoke bg-white cursor-pointer rounded-full p-1.5 text-center text-2xl ring-2"
        >
            {children}
        </button>
    );
}
