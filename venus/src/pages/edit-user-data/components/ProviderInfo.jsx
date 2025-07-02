import { getOauth2ProviderIcon } from "../../../utils/account.jsx";

export default function ProviderInfo({ provider, email }) {
    return (
        <div className="flex flex-col items-center rounded-md bg-amber-50 p-3 text-center text-lg">
            <div className="mb-2 flex space-x-3">
                <p>Your account was created via {provider}</p>
                {getOauth2ProviderIcon(provider)}
            </div>
            <p>
                Your email address is {email} <br /> and cannot be changed.
            </p>
        </div>
    );
}
