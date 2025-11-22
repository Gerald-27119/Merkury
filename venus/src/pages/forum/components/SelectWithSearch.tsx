import Select, { MultiValue, SingleValue } from "react-select";
import Option from "../../../model/interface/forum/selectOption";
import { useRef } from "react";
import { useBoolean } from "../../../hooks/useBoolean";

interface SelectClassNames {
    control?: (...args: any[]) => string;
    menu?: (...args: any[]) => string;
    option?: (...args: any[]) => string;
    singleValue?: (...args: any[]) => string;
    placeholder?: (...args: any[]) => string;
    multiValue?: (...args: any[]) => string;
    multiValueLabel?: (...args: any[]) => string;
    multiValueRemove?: (...args: any[]) => string;
    clearIndicator?: (...args: any[]) => string;
}

interface SelectWithSearchProps {
    placeholder: string;
    isMultiChoice: boolean;
    maxOptionChoice?: number;
    options: Option[];
    value: Option | Option[] | undefined;
    isClearable: boolean;
    onChange?: (val: any) => void;
    onBlur?: () => void;
    error?: string;
    classNames?: SelectClassNames;
}

export default function SelectWithSearch({
    placeholder,
    isMultiChoice,
    maxOptionChoice,
    options,
    value,
    isClearable,
    onChange,
    onBlur,
    error,
    classNames,
}: SelectWithSearchProps) {
    const [isLimitWarningVisible, showLimitWarning, hideLimitWarning] =
        useBoolean(false);
    const selectRef = useRef<any>(null);

    const handleChange = (
        selected: MultiValue<Option> | SingleValue<Option>,
    ) => {
        if (
            isMultiChoice &&
            maxOptionChoice &&
            Array.isArray(selected) &&
            selected.length > maxOptionChoice
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
                    control: (provided) => ({
                        ...provided,
                        cursor: "pointer",
                        minHeight: 30,
                    }),
                    input: (provided) => ({ ...provided, cursor: "text" }),
                    option: (provided) => ({ ...provided, cursor: "pointer" }),
                }}
                classNames={classNames}
            />
            {error && (
                <p className="mt-1 text-xs font-bold break-words text-red-500">
                    {error}
                </p>
            )}
            {isLimitWarningVisible && !error && (
                <p className="mt-1 text-xs font-bold break-words text-yellow-500">
                    You can't select more than 3 tags
                </p>
            )}
        </div>
    );
}
