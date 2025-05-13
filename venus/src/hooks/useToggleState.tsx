import { useCallback, useState } from "react";

export function useToggleState(initialState = false) {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => {
    setState((prevState) => !prevState);
  }, []);

  return [state, setState, toggle] as const;
}
