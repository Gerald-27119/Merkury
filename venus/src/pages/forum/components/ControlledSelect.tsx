import SelectWithSearch from "./SelectWithSearch";
import Option from "../../../model/interface/forum/selectOption";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import selectFormClassNames from "../../../model/styles/selectFormClassNames";

interface ControlledSelectProps<T extends FieldValues> {
    name: Path<T>;
    placeholder: string;
    control: Control<T>;
    isMultiChoice: boolean;
    maxOptionChoice?: number;
    options: Option[];
    error?: string;
}

export default function ControlledSelect<T extends FieldValues>({
    name,
    control,
    placeholder,
    isMultiChoice,
    maxOptionChoice,
    options,
    error,
}: ControlledSelectProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <SelectWithSearch
                    placeholder={placeholder}
                    isMultiChoice={isMultiChoice}
                    maxOptionChoice={maxOptionChoice}
                    options={options}
                    value={field.value}
                    isClearable={true}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={error}
                    classNames={selectFormClassNames}
                />
            )}
        />
    );
}
