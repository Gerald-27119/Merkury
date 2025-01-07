import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaRegQuestionCircle } from "react-icons/fa";

export default function ShowProvider({ provider, email }) {
  const getProviderIcon = () => {
    switch (provider) {
      case "GOOGLE":
        return <FcGoogle size={25} />;
      case "GITHUB":
        return <FaGithub size={25} />;
      default:
        return <FaRegQuestionCircle size={25} />;
    }
  };

  return (
    <div className="flex flex-col items-center bg-amber-50 p-3 rounded-md text-lg text-center">
      <div className="flex space-x-3 mb-2">
        <p>Your account was created via {provider}</p>
        {getProviderIcon()}
      </div>
      <p>
        Your email address is {email} <br /> and cannot be changed.
      </p>
    </div>
  );
}
