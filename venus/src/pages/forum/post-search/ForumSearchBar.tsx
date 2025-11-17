import { HiMenu } from "react-icons/hi";
import useDebounce from "../../../hooks/useDebounce";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBoolean } from "../../../hooks/useBoolean";
import { searchPosts } from "../../../http/posts";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useNavigate } from "react-router-dom";

interface ForumSearchBarProps {
    onSearch?: () => void;
}

export default function ForumSearchBar({ onSearch }: ForumSearchBarProps) {
    const [searchPhrase, setSearchPhrase] = useState("");
    const debouncedPhrase = useDebounce(searchPhrase, 500);
    const [areHintsShown, showHints, hideHints] = useBoolean();
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    useClickOutside(searchRef, hideHints, areHintsShown);

    const { data: postTitles = [] } = useQuery({
        queryKey: ["postTitles", debouncedPhrase],
        queryFn: () => searchPosts(debouncedPhrase),
        enabled: debouncedPhrase.trim().length > 0,
    });

    useEffect(() => {
        if (debouncedPhrase.trim().length === 0) {
            hideHints();
        }
    }, [debouncedPhrase]);

    const handlePhraseChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setSearchPhrase(e.target.value);
        if (e.target.value.trim().length > 0) {
            showHints();
        }
    };
    const handleHintClick = (hint: string) => {
        setSearchPhrase(hint);
        hideHints();
        inputRef.current?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchPhrase) params.set("q", searchPhrase);
        navigate(`/forum/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="relative" ref={searchRef}>
                <div className="dark:bg-darkBgSoft bg-lightBgSoft mb-4 flex items-center gap-2 rounded-2xl p-2 shadow-lg">
                    <input
                        className="focus:outline-none"
                        placeholder="Search"
                        ref={inputRef}
                        value={searchPhrase}
                        onChange={handlePhraseChange}
                        onFocus={() => {
                            if (searchPhrase.trim().length > 0) showHints();
                        }}
                    ></input>
                    <button className="cursor-pointer text-2xl" type="button">
                        <HiMenu />
                    </button>
                </div>
                {areHintsShown && postTitles.length > 0 && (
                    <div className="dark:border-darkBorder dark:bg-darkBgSoft absolute top-full left-0 w-full rounded-md border bg-white shadow-lg">
                        <ul className="items-center py-1 text-sm">
                            {postTitles.map((title) => (
                                <li
                                    key={title}
                                    className="dark:hover:bg-darkBgMuted flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100"
                                    onClick={() => handleHintClick(title)}
                                >
                                    {title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </form>
    );
}
