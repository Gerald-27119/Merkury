import Select from "react-select";

interface Option {
  value: string;
  label: string;
}

interface SelectWithSearchProps {
  placeholder: string;
  isMultiChoice: boolean;
  options: Option[];
  isValid: { value: boolean; message: string };
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onBlur: () => void;
}

export default function SelectWithSearch({
  placeholder,
  isMultiChoice,
  options,
  value,
  onChange,
  onBlur,
  isValid,
}: SelectWithSearchProps) {
  const isLoading = !options || options.length === 0;

  return (
    <div className="w-full max-w-[600px]">
      <Select
        isMulti={isMultiChoice}
        closeMenuOnSelect={!isMultiChoice}
        options={options}
        isClearable
        placeholder={placeholder}
        isLoading={isLoading}
        unstyled
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (provided) => ({ ...provided, zIndex: 100 }),
          control: (provided) => ({ ...provided, cursor: "pointer" }),
          input: (provided) => ({ ...provided, cursor: "text" }),
          option: (provided) => ({ ...provided, cursor: "pointer" }),
        }}
        classNames={{
          control: () =>
            "rounded-lg dark:bg-darkBg bg-lightBgSoft p-2 shadow-lg",
          menu: () =>
            "dark:bg-darkBg bg-lightBgSoft border mt-1 rounded-lg shadow-lg dark:text-darkText text-lightText",
          option: ({ isSelected, isFocused }) =>
            `px-2 py-1 rounded-lg ${
              isSelected
                ? "dark:bg-darkBgMuted dark:text-darkText"
                : isFocused
                  ? "bg-darkBgMuted"
                  : "dark:bg-darkBg"
            }`,
          singleValue: () => "dark:text-darkText text-lightText",
          placeholder: () => "dark:text-darkText/50 text-lightText/60",
          multiValue: () =>
            "dark:bg-darkBgSoft dark:text-darkText text-lightText rounded px-2 py-1 mr-1 mt-1 flex items-center",
          multiValueLabel: () => "text-sm mr-1",
          multiValueRemove: () =>
            "dark:text-darkText text-lightText dark:hover:text-red-500 hover:text-red-500 cursor-pointer",
          clearIndicator: () => "hover:text-red-500",
        }}
      />
    </div>
  );
}
