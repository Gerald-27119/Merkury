import Select, { MultiValue, SingleValue } from "react-select";
import Option from "../../../model/interface/forum/selectOption";
import { useRef } from "react";
import { selectVariants } from "../../../model/styles/selectVariants";
import { SelectClassNames } from "../../../model/interface/forum/selectClassNames";
import { selectBaseClassNames } from "../../../model/styles/selectBaseClassNames";

interface SelectWithSearchProps {
    placeholder: string;
    isMultiChoice: boolean;
    options: Option[];
    value: Option | Option[] | null;
    isClearable: boolean;
    onChange?: (val: any) => void;
    onBlur?: () => void;
    error?: string;
    variant: "form" | "search";
}

export default function SelectWithSearch({
    placeholder,
    isMultiChoice,
    options,
    value,
    isClearable,
    onChange,
    onBlur,
    error,
    variant = "form",
}: SelectWithSearchProps) {
    const selectRef = useRef<any>(null);

    const handleChange = (
        selected: MultiValue<Option> | SingleValue<Option>,
    ) => {
        onChange?.(selected);

        if (!isMultiChoice) {
            selectRef.current?.blur();
        }
    };

    const mergedClassNames: SelectClassNames = {
        ...selectBaseClassNames,
        ...selectVariants[variant],
    };

    return (
        <div className="w-full">
            <Select
                ref={selectRef}
                isMulti={isMultiChoice}
                closeMenuOnSelect={!isMultiChoice}
                options={options}
                isClearable={isClearable}
                placeholder={placeholder}
                isLoading={!options || options.length === 0}
                unstyled
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                menuPortalTarget={document.body}
                styles={{
                    menuPortal: (provided) => ({ ...provided, zIndex: 100 }),
                    input: (provided) => ({ ...provided, cursor: "text" }),
                    option: (provided) => ({ ...provided, cursor: "pointer" }),
                    control: (provided) => ({
                        ...provided,
                        cursor: "pointer",
                        minHeight: 30,
                        overflow: "hidden",
                    }),
                    valueContainer: (provided) => ({
                        ...provided,
                        overflowX: "auto",
                        flexWrap: "nowrap",
                        scrollbarWidth: "thin",
                    }),
                    multiValue: (provided) => ({
                        ...provided,
                        flexShrink: 0,
                    }),
                }}
                classNames={mergedClassNames}
            />
            {error && (
                <p className="mt-1 text-xs font-bold break-words text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
