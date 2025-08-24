import Select, { MultiValue, SingleValue } from "react-select";
import Option from "../../../model/interface/forum/selectOption";
import { useRef } from "react";
import { useBoolean } from "../../../hooks/useBoolean";
import selectClassNames from "../../../model/styles/selectClassNames";

interface SelectWithSearchProps {
    placeholder: string;
    isMultiChoice: boolean;
    options: Option[];
    value: Option | Option[];
    onChange: (val: any) => void;
    onBlur: () => void;
    error?: string;
}

export default function SelectWithSearch({
    placeholder,
    isMultiChoice,
    options,
    value,
    onChange,
    onBlur,
    error,
}: SelectWithSearchProps) {
    const maxOptions = 3;
    const selectRef = useRef<any>(null);
    const [isLimitWarningVisible, showLimitWarning, hideLimitWarning] =
        useBoolean(false);

    const handleChange = (
        selected: MultiValue<Option> | SingleValue<Option>,
    ) => {
        if (
            isMultiChoice &&
            Array.isArray(selected) &&
            selected.length > maxOptions
        ) {
            showLimitWarning();
            setTimeout(() => hideLimitWarning(), 2000);
            selectRef.current?.blur();
            return;
        }

        onChange?.(selected);

        if (!isMultiChoice) {
            selectRef.current?.blur();
        }
    };

    return (
        <div className="w-full">
            <Select
                ref={selectRef}
                isMulti={isMultiChoice}
                closeMenuOnSelect={!isMultiChoice}
                options={options}
                isClearable
                placeholder={placeholder}
                isLoading={!options || options.length === 0}
                unstyled
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                menuPortalTarget={document.body}
                styles={{
                    menuPortal: (provided) => ({ ...provided, zIndex: 100 }),
                    control: (provided) => ({ ...provided, cursor: "pointer" }),
                    input: (provided) => ({ ...provided, cursor: "text" }),
                    option: (provided) => ({ ...provided, cursor: "pointer" }),
                }}
                classNames={selectClassNames}
            />
            {error && (
                <p className="text-xs font-bold break-words text-red-500">
                    {error}
                </p>
            )}
            {isLimitWarningVisible && !error && (
                <p className="text-xs font-bold break-words text-yellow-500">
                    You can't select more than 3 tags
                </p>
            )}
        </div>
    );
}
