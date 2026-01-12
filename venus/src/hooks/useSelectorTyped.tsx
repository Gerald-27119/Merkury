import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function useSelectorTyped<T>(selector: (state: RootState) => T) {
    return useSelector(selector);
}
