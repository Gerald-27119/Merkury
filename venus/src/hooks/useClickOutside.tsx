import { useEffect, RefObject } from "react";

export function useClickOutside(
    ref: RefObject<HTMLElement>,
    handler: () => void,
    active: boolean,
) {
    useEffect(() => {
        if (!active) return;
        const listener = (event: MouseEvent) => {
            // Do nothing if clicking ref’s element or its descendants
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };

        document.addEventListener("click", listener, true);
        return () => {
            document.removeEventListener("click", listener, true);
        };
    }, [ref, handler, active]);
}
