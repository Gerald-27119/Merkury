import { getOauth2ProviderIcon } from "../../utils/account.jsx";

export default function ProviderInfo({ provider, email }) {
  return (
    <div className="flex flex-col items-center bg-amber-50 p-3 rounded-md text-lg text-center">
      <div className="flex space-x-3 mb-2">
        <p>Your account was created via {provider}</p>
        {getOauth2ProviderIcon(provider)}
      </div>
      <p>
        Your email address is {email} <br /> and cannot be changed.
      </p>
    </div>
  );
}
