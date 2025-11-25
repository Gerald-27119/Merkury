import { HiMenu } from "react-icons/hi";
import useDebounce from "../../../hooks/useDebounce";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBoolean } from "../../../hooks/useBoolean";
import { searchPosts } from "../../../http/posts";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useNavigate } from "react-router-dom";
import PostCategoryDto from "../../../model/interface/forum/postCategoryDto";
import TagDto from "../../../model/interface/tagDto";
import SearchHintsList from "./SearchHintsList";
import SelectWithSearch from "../components/SelectWithSearch";
import selectSearchClassNames from "../../../model/styles/selectSearchClassNames";
import { FaSearch } from "react-icons/fa";
import Option from "../../../model/interface/forum/selectOption";
import SearchFieldInput from "./SearchFieldInput";

interface ForumSearchBarProps {
    categories: PostCategoryDto[];
    tags: TagDto[];
}

export default function ForumSearchBar({
    categories,
    tags,
}: ForumSearchBarProps) {
    const [searchPhrase, setSearchPhrase] = useState("");
    const [userName, setUserName] = useState("");
    const [searchCategory, setSearchCategory] = useState<Option>();
    const [searchTags, setSearchTags] = useState<Option[]>();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const debouncedPhrase = useDebounce(searchPhrase, 500);

    const [areHintsShown, showHints, hideHints] = useBoolean();
    const [isMenuOpen, openMenu, closeMenu] = useBoolean();

    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useClickOutside(searchRef, hideHints, areHintsShown);

    const categoryOptions = categories.map((category) => ({
        value: category.name,
        label: category.name,
    }));

    const tagOptions = tags.map((tag) => ({
        value: tag.name,
        label: tag.name,
    }));

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

    const handleMenuClick = () => {
        hideHints();
        isMenuOpen ? closeMenu() : openMenu();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        hideHints();
        const params = new URLSearchParams();
        if (searchPhrase) params.set("q", searchPhrase);
        if (searchCategory) params.set("category", searchCategory.value);
        if (searchTags?.length)
            searchTags.forEach((tag) => params.append("tags", tag.value));
        if (fromDate) params.set("from", fromDate);
        if (toDate) params.set("to", toDate);
        if (userName) params.set("author", userName);
        navigate(`/forum/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div ref={searchRef}>
                <div
                    className={`dark:bg-darkBgSoft bg-lightBgSoft flex items-center gap-2 ${isMenuOpen ? "rounded-t-2xl" : "rounded-2xl shadow-lg"} relative p-2`}
                >
                    <input
                        className="focus:outline-none"
                        type="text"
                        placeholder="Search"
                        ref={inputRef}
                        value={searchPhrase}
                        onChange={handlePhraseChange}
                        onFocus={() => {
                            if (searchPhrase.trim().length > 0) showHints();
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmit(e);
                        }}
                    ></input>
                    <button
                        className={`${isMenuOpen ? "rotate-90" : ""} absolute right-3 cursor-pointer text-2xl`}
                        type="button"
                        onClick={handleMenuClick}
                    >
                        <HiMenu />
                    </button>
                    {areHintsShown && (
                        <SearchHintsList
                            hints={postTitles}
                            onHintClick={handleHintClick}
                        />
                    )}
                </div>

                {isMenuOpen && (
                    <div className="dark:bg-darkBgSoft bg-lightBg rounded-b-2xl p-2 text-sm shadow-lg">
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            <div>
                                <p className="mb-1">Category</p>
                                <SelectWithSearch
                                    placeholder=""
                                    isMultiChoice={false}
                                    options={categoryOptions}
                                    value={searchCategory}
                                    isClearable={true}
                                    onChange={setSearchCategory}
                                    classNames={selectSearchClassNames}
                                />
                            </div>

                            <div>
                                <p className="mb-1">Tags</p>
                                <SelectWithSearch
                                    placeholder=""
                                    isMultiChoice={true}
                                    options={tagOptions}
                                    value={searchTags}
                                    isClearable={false}
                                    onChange={setSearchTags}
                                    classNames={selectSearchClassNames}
                                />
                            </div>

                            <SearchFieldInput
                                label="From"
                                inputType="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />

                            <SearchFieldInput
                                label="To"
                                inputType="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />

                            <SearchFieldInput
                                label="Posted By"
                                inputType="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                Icon={FaSearch}
                            />
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
}
