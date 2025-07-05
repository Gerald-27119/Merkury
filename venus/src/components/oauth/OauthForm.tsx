import OauthButton from "./OauthButton";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { githubLoginUrl, googleLoginUrl } from "../../http/account.js";
import { accountAction } from "../../redux/account";
import useDispatchTyped from "../../hooks/useDispatchTyped";

export default function OauthForm() {
    const dispatch = useDispatchTyped();

    const handleAuth = (provider: string) => {
        window.location.href =
            provider === "GOOGLE" ? googleLoginUrl : githubLoginUrl;
        dispatch(accountAction.setIsLogged());
    };

    return (
        <>
            <OauthButton onClick={() => handleAuth("GOOGLE")}>
                <FcGoogle className="mr-3" aria-label="googleIcon" size={25} />
                Continue with Google account.
            </OauthButton>
            <OauthButton onClick={() => handleAuth("GITHUB")}>
                <FaGithub className="mr-3" aria-label="githubIcon" size={25} />
                Continue with Github account.
            </OauthButton>
        </>
    );
}
