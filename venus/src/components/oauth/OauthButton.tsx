import { ReactNode } from "react";

interface OauthButtonProps {
  children: ReactNode;
  onClick: () => void;
}

export default function OauthButton({ children, onClick }: OauthButtonProps) {
  return (
    <button
      onClick={onClick}
      className="mt-2 flex w-full cursor-pointer items-center rounded-md bg-gray-700/90 p-3 text-sm break-words text-white shadow-md shadow-gray-800/20 transition-all duration-300 hover:bg-gray-700 sm:text-lg dark:bg-gray-800 dark:shadow-black/50 dark:hover:bg-gray-800/50"
    >
      {children}
    </button>
  );
}
