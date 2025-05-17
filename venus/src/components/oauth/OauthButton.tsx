import { ReactNode } from "react";

interface OauthButtonProps {
  children: ReactNode;
  onClick: () => void;
}

export default function OauthButton({ children, onClick }: OauthButtonProps) {
  return (
    <button
      onClick={onClick}
      className="mt-2 flex w-full cursor-pointer items-center rounded-md bg-gray-700 p-3 text-lg text-white transition-all duration-300 hover:bg-gray-600"
    >
      {children}
    </button>
  );
}
