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
      <Button
        classNames={
          "px-1.5 bg-gradient-to-r from-purple-500  to-teal-500 hover:to-purple-600  hover:from-teal-600 duration-600 justify-center rounded text-center align-middle leading-normal text-fuchsia-50 transition-all delay-200 ease-in-out"
        }
        onClick={handleSignOut}
      >
        Sign out
      </Button>
    </>
  );
}
