import OauthButton from "../OauthButton.jsx";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { githubLogoutUrl, googleLogoutUrl } from "../../http/account.js";

export default function OauthForm() {
  function handleGoogleAuth() {
    window.location.href = googleLogoutUrl;
  }

  function handleGithubAuth() {
    window.location.href = githubLogoutUrl;
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
