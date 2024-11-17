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
      console.log("error logout: ", error);
    }
    window.location.href = "/";
  };

  const customStyle = {
    backgroundColor: "red",
    fontSize: "20px",
  };

  return (
    <>
      <Button onClick={handleSignOut} className="text-3xl" style={customStyle}>
        Sign out
      </Button>
    </>
  );
}
