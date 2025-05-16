import { ReactElement } from "react";

interface FriendButtonProps {
  children: ReactElement;
  onClick: () => void;
  isActive?: boolean;
}

export default function SocialButton({
  children,
  onClick,
  isActive,
}: FriendButtonProps) {
  return (
    <button
      className={`dark:bg-violetDark dark:hover:bg-violetLight bg-violetLight hover:bg-violetLighter flex w-full cursor-pointer items-center justify-center rounded-md py-1.5 transition-all duration-300 ${isActive && "dark:bg-violetLight bg-violetLighter"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
