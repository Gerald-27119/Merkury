import OauthButton from "../OauthButton.jsx";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function OauthForm() {
  function handleGoogleAuth() {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  }

  function handleGithubAuth() {
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
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
