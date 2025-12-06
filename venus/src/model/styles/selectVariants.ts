export const selectVariants = {
    form: {
        control: () => "rounded-lg dark:bg-darkBg bg-lightBgSoft p-2 shadow-lg",
        menu: () =>
            "dark:bg-darkBg bg-lightBgSoft border mt-1 rounded-lg shadow-lg dark:text-darkText text-lightText",
        multiValue: () =>
            "dark:bg-darkBgSoft bg-darkText cursor-default rounded-lg px-2 py-1 mr-1 mt-1 flex items-center",
    },

    search: {
        control: () =>
            "rounded-lg dark:bg-darkBg bg-lightBgSoft p-1 shadow-lg text-sm",
        menu: () =>
            "dark:bg-darkBg bg-lightBgSoft border mt-1 rounded-lg shadow-lg dark:text-darkText text-lightText text-sm",
        multiValue: () =>
            "dark:bg-darkBgSoft bg-darkText cursor-default rounded-lg px-2 mr-1 mt-1 flex items-center",
    },
};
