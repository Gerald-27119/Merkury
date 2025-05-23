interface ProfileButtonProps {
  onClick: () => void;
  text: string;
}

export default function ProfileButton({ onClick, text }: ProfileButtonProps) {
  return (
    <button
      onClick={onClick}
      className="dark:bg-violetDark bg-violetLight dark:hover:bg-violetDark/80 hover:bg-violetLight/80 w-full cursor-pointer rounded-md px-2 py-1.5 capitalize"
    >
      {text}
    </button>
  );
}
