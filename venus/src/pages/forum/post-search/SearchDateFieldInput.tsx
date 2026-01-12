import { ConfigProvider, DatePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface SearchDateFieldInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
}

export default function SearchDateFieldInput({
    label,
    value,
    onChange,
}: SearchDateFieldInputProps) {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const checkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        };
        checkMode();

        const observer = new MutationObserver(checkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div>
            {label && <p className="mb-1">{label}</p>}

            <ConfigProvider
                theme={{
                    token: {
                        colorBgContainer: isDarkMode
                            ? "var(--color-darkBg)"
                            : "var(--color-lightBgSoft)",
                        colorText: isDarkMode
                            ? "var(--color-darkText)"
                            : "var(--color-lightText)",
                        colorTextDescription: isDarkMode
                            ? "var(--color-grayText)"
                            : "#6b7280",
                        colorBorder: "transparent",
                        borderRadius: 8,
                        colorPrimary: "var(--color-mainBlue)",
                        motion: false,
                    },

                    components: {
                        DatePicker: {
                            colorBgContainer: isDarkMode
                                ? "var(--color-darkBg)"
                                : "var(--color-lightBgSoft)",
                            colorText: isDarkMode
                                ? "var(--color-darkText)"
                                : "var(--color-lightText)",
                            colorTextPlaceholder: isDarkMode
                                ? "var(--color-darkBorder)"
                                : "#9ca3af",
                            colorBorder: "transparent",
                            colorBgElevated: isDarkMode
                                ? "var(--color-darkBgSoft)"
                                : "var(--color-lightBgSoft)",
                            colorTextDisabled: isDarkMode ? "#777" : "#c0c0c0",
                            controlItemBgHover: isDarkMode
                                ? "var(--color-darkBgMuted)"
                                : "var(--color-lightGrayishBlue)",
                            controlItemBgActive: "var(--color-mainBlue)",
                        },
                    },
                }}
            >
                <DatePicker
                    placeholder="Select date"
                    format="DD.MM.YYYY"
                    value={value ? dayjs(value, "YYYY-MM-DD") : null}
                    onChange={(date) => {
                        if (!date) {
                            onChange?.("");
                            return;
                        }
                        onChange(date.format("YYYY-MM-DD"));
                    }}
                    style={{ width: "100%" }}
                />
            </ConfigProvider>
        </div>
    );
}
