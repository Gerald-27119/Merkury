interface ModalButtonProps {
  onClick: () => void;
  className: string;
  text: string;
}

export default function ModalButton({
  onClick,
  text,
  className,
}: ModalButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-md px-2 py-1.5 text-center capitalize shadow-md ${className}`}
    >
      {text}
    </button>
  );
}
