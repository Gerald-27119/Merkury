import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ReturnButton() {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(-1)}
            className="dark:bg-violetDark bg-violetLight text-darkText dark:hover:bg-violetDarker hover:bg-violetLight mb-4 h-[2.5rem] w-[2.4rem] cursor-pointer rounded-full p-2 shadow-lg"
        >
            <FaArrowLeft size={20} />
        </button>
    );
}
