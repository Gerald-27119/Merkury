import { ReactElement } from "react";

interface FriendButtonProps {
  children: ReactElement;
  onClick: () => void;
}

export default function FriendButton({ children, onClick }: FriendButtonProps) {
  return (
    <button
      className="bg-violetDark hover:bg-violetLight flex w-full cursor-pointer items-center justify-center rounded-md py-1.5"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
