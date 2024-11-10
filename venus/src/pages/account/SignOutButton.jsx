import axios from "axios";
import Button from "./Button.jsx";

export default function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await axios.post(
        "http://localhost:8080/account/oauth2/logout",
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error("error logout: ", error);
    }
    window.location.href = "/";
  };

  return (
    <>
      <Button classNames={"px-1.5"} onClick={handleSignOut}>
        Sign out
      </Button>
    </>
  );
}
