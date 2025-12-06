export interface SelectClassNames {
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
