import { createPortal } from "react-dom";
import { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
    isOpen: boolean;
    className?: string;
}

export default function EmptyModal({
    onClose,
    children,
    isOpen,
    className,
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
                        className="fixed inset-0 z-60 bg-black/70"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <motion.div
                        className={`dark:bg-darkBg dark:text-darkText bg-lightBgMuted text-lightText fixed top-1/2 left-1/2 z-61 -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl shadow-lg ${className}`}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="scrollbar-w-0 scrollbar scrollbar-auto max-h-[80vh] overflow-y-auto overscroll-contain p-8">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        modalRoot,
    );
}
