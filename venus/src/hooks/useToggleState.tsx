import { useCallback, useState } from "react";

export function useToggleState(initialState = false) {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => {
    setState((prevState) => !prevState);
  }, []);

  return [state, toggle] as const;
}
