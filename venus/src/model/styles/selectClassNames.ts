const selectClassNames = {
    control: () => "rounded-lg dark:bg-darkBg bg-lightBgSoft p-2 shadow-lg",
    menu: () =>
        "dark:bg-darkBg bg-lightBgSoft border mt-1 rounded-lg shadow-lg dark:text-darkText text-lightText",
    option: ({
        isSelected,
        isFocused,
    }: {
        isSelected: boolean;
        isFocused: boolean;
    }) =>
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
};

export default selectClassNames;
