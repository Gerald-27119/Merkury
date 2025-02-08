import OauthButton from "../OauthButton.jsx";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { githubLoginUrl, googleLoginUrl } from "../../http/account.js";
import { useDispatch } from "react-redux";
import { accountAction } from "../../redux/account.jsx";

export default function OauthForm() {
  const dispatch = useDispatch();

  const handleAuth = (provider) => {
    window.location.href =
      provider === "GOOGLE" ? googleLoginUrl : githubLoginUrl;
    dispatch(accountAction.setIsLogged());
  };

  return (
    <>
      <OauthButton onClick={() => handleAuth("GOOGLE")}>
        <FcGoogle className="mr-3" size={25} />
        Continue with Google account.
      </OauthButton>
      <OauthButton onClick={() => handleAuth("GITHUB")}>
        <FaGithub className="mr-3" size={25} />
        Continue with Github account.
      </OauthButton>
    </>
  );
}
