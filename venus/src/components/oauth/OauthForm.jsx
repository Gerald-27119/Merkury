import OauthButton from "../OauthButton.jsx";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { githubLogoutUrl, googleLogoutUrl } from "../../http/account.js";
import { useDispatch } from "react-redux";
import { accountAction } from "../../redux/account.jsx";

export default function OauthForm() {
  const dispatch = useDispatch();

  function handleGoogleAuth() {
    window.location.href = googleLogoutUrl;
    dispatch(accountAction.setIsLogged());
  }

  function handleGithubAuth() {
    window.location.href = githubLogoutUrl;
    dispatch(accountAction.setIsLogged());
  }

  return (
    <>
      <OauthButton onClick={handleGoogleAuth}>
        <FcGoogle className="mr-3" size={25} />
        Continue with Google account.
      </OauthButton>
      <OauthButton onClick={handleGithubAuth}>
        <FaGithub className="mr-3" size={25} />
        Continue with Github account.
      </OauthButton>
    </>
  );
}
