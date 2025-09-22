import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ReturnButton() {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(-1)}
            className="dark:bg-violetDark bg-violetLight/80 dark:hover:bg-violetDarker hover:bg-violetLight absolute -top-12 left-2 mb-4 rounded-full p-2 shadow-lg"
        >
            <FaArrowLeft size={20} />
        </button>
    );
}
