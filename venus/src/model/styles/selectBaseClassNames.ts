export const selectBaseClassNames = {
    option: ({
        isSelected,
        isFocused,
    }: {
        isSelected: boolean;
        isFocused: boolean;
    }) =>
        `px-2 py-1 rounded-lg ${
            isSelected
                ? "dark:bg-darkBgMuted bg-lightBgDarker"
                : isFocused
                  ? "dark:bg-darkBgMuted bg-lightBgDarker"
                  : ""
        }`,

    singleValue: () => "dark:text-darkText text-lightText",
    placeholder: () => "dark:text-darkText/50 text-lightText/60",
    multiValueLabel: () => "text-sm mr-1",
    multiValueRemove: () => "hover:text-red-500 cursor-pointer",
    clearIndicator: () => "hover:text-red-500",
};
