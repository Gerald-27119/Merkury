import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaRegQuestionCircle } from "react-icons/fa";

export function getOauth2ProviderIcon(provider) {
    switch (provider) {
        case "GOOGLE":
            return <FcGoogle size={25} />;
        case "GITHUB":
            return <FaGithub size={25} />;
        default:
            return <FaRegQuestionCircle size={25} />;
    }
}
