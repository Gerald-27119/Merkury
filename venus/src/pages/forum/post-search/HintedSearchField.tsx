import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../../../hooks/useDebounce";
import { useBoolean } from "../../../hooks/useBoolean";
import SearchHintsList from "./SearchHintsList";
import { useClickOutside } from "../../../hooks/useClickOutside";

interface HintedSearchFieldProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    fetchHints: (phrase: string) => Promise<string[]>;
    debounceMs?: number;
    className?: string;
}

export default function HintedSearchField({
    placeholder = "Search…",
    value,
    onChange,
    onSubmit,
    fetchHints,
    debounceMs = 500,
    className,
}: HintedSearchFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLInputElement>(null);
    const [areHintsShown, showHints, hideHints] = useBoolean();
    const debouncedPhrase = useDebounce(value, debounceMs);

    useClickOutside(wrapperRef, hideHints, areHintsShown);

    const { data: hints = [] } = useQuery({
        queryKey: ["hints", debouncedPhrase],
        queryFn: () => fetchHints(debouncedPhrase),
        enabled: debouncedPhrase.trim().length > 0,
    });

    useEffect(() => {
        if (debouncedPhrase.trim().length === 0) {
            hideHints();
        }
    }, [debouncedPhrase]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        if (e.target.value.trim().length > 0) {
            showHints();
        }
    };

    const handleHintClick = (hint: string) => {
        onChange(hint);
        hideHints();
        inputRef.current?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        hideHints();
        onSubmit(e);
    };

    return (
        <div className="relative flex-grow pr-8" ref={wrapperRef}>
            <input
                className={`w-full focus:outline-none ${className}`}
                placeholder={placeholder}
                ref={inputRef}
                value={value}
                onChange={handleChange}
                onFocus={() => value.trim().length > 0 && showHints()}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit(e);
                }}
            />

            {areHintsShown && (
                <SearchHintsList hints={hints} onHintClick={handleHintClick} />
            )}
        </div>
    );
}
