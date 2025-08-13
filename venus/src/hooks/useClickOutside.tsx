import React, { ReactElement, useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(
    ref: React.RefObject<T>,
    handler: (event: MouseEvent) => void,
    active: boolean,
) {
    useEffect(() => {
        if (!active) return;
        function listener(event: MouseEvent) {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        }
        document.addEventListener("mousedown", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
        };
    }, [ref, handler, active]);
}
