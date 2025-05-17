import { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { useBoolean } from "../../hooks/useBoolean";

interface InputProps {
  label: string;
  id: string;
  isValid: { value: boolean; message: string };
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

export default function FormInput({
  label,
  id,
  isValid,
  value,
  onBlur,
  type,
  onChange,
}: InputProps) {
  const [isFocused, setFocusedToTrue, setFocusedToFalse] = useBoolean(false);

  const shouldFloat = isFocused || Boolean(value);

  const handleOnBlur = () => {
    setFocusedToFalse();
    onBlur();
  };

  return (
    <div className="relative">
      <motion.label
        htmlFor={id}
        initial={false}
        animate={{
          top: shouldFloat ? "-0.7rem" : "0.5rem",
          left: "0.75rem",
          fontSize: shouldFloat ? "0.75rem" : "1rem",
          opacity: shouldFloat ? 1 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="dark:text-darkText text-lightText pointer-events-none absolute z-10 px-1 capitalize"
      >
        {label}
      </motion.label>

      <input
        id={id}
        value={value}
        type={type}
        onChange={onChange}
        onFocus={setFocusedToTrue}
        onBlur={handleOnBlur}
        className="dark:bg-darkBgMuted bg-lightBgMuted dark:text-darkText text-lightText w-full rounded-md p-2 shadow-md focus:outline-none dark:shadow-black/50"
      />

      {!isValid?.value && (
        <p className="mt-1 text-sm font-bold break-words text-red-500">
          {isValid?.message}
        </p>
      )}
    </div>
  );
}
