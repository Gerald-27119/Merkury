import { createPortal } from "react-dom";
import { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import Button from "../buttons/Button";
import { ButtonVariantType } from "../../model/enum/buttonVariantType";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  onClick: () => void;
  isOpen: boolean;
}

export default function Modal({
  onClose,
  children,
  onClick,
  isOpen,
}: ModalProps) {
  const modalRoot = document.getElementById("modal");
  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <AnimatePresence initial={false}>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ></motion.div>
          <motion.div
            className="dark:bg-darkBgSoft dark:text-darkText bg-lightBgSoft text-lightText fixed top-1/2 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md p-8 shadow-md"
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            {children}
            <form method="dialog" className="mt-3 flex space-x-3">
              <Button
                variant={ButtonVariantType.MODAL}
                onClick={onClose}
                className="bg-red-600 hover:bg-red-700"
                text="no"
              />
              <Button
                variant={ButtonVariantType.MODAL}
                onClick={onClick}
                className="bg-green-600 hover:bg-green-700"
                text="yes"
              />
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    modalRoot,
  );
}
