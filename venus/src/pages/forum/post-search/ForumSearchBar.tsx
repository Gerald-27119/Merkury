import { HiMenu } from "react-icons/hi";
import React, { useState } from "react";
import { useBoolean } from "../../../hooks/useBoolean";
import { searchPosts } from "../../../http/posts";
import { useNavigate } from "react-router-dom";
import PostCategoryDto from "../../../model/interface/forum/postCategoryDto";
import TagDto from "../../../model/interface/tagDto";
import SelectWithSearch from "../components/SelectWithSearch";
import selectSearchClassNames from "../../../model/styles/selectSearchClassNames";
import Option from "../../../model/interface/forum/selectOption";
import SearchDateFieldInput from "./SearchDateFieldInput";
import HintedSearchField from "./HintedSearchField";
import { searchUsers } from "../../../http/user";
import { FaSearch } from "react-icons/fa";

interface ForumSearchBarProps {
    categories: PostCategoryDto[];
    tags: TagDto[];
}

export default function ForumSearchBar({
    categories,
    tags,
}: ForumSearchBarProps) {
    const [searchPhrase, setSearchPhrase] = useState("");
    const [username, setUsername] = useState("");
    const [searchCategory, setSearchCategory] = useState<Option>();
    const [searchTags, setSearchTags] = useState<Option[]>();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [isMenuOpen, openMenu, closeMenu] = useBoolean();

    const navigate = useNavigate();

    const categoryOptions = categories.map((category) => ({
        value: category.name,
        label: category.name,
    }));

    const tagOptions = tags.map((tag) => ({
        value: tag.name,
        label: tag.name,
    }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchPhrase) params.set("q", searchPhrase);
        if (searchCategory) params.set("category", searchCategory.value);
        if (searchTags?.length)
            searchTags.forEach((tag) => params.append("tags", tag.value));
        if (fromDate) params.set("from", fromDate);
        if (toDate) params.set("to", toDate);
        if (username) params.set("author", username);
        navigate(`/forum/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <div
                    className={`dark:bg-darkBgSoft bg-lightBgSoft flex items-center gap-2 ${isMenuOpen ? "rounded-t-2xl" : "rounded-2xl shadow-lg"} relative p-2`}
                >
                    <HintedSearchField
                        placeholder="Search"
                        value={searchPhrase}
                        onChange={setSearchPhrase}
                        fetchHints={searchPosts}
                        onSubmit={handleSubmit}
                    />

                    <button
                        className={`${isMenuOpen ? "rotate-90" : ""} absolute right-3 cursor-pointer text-2xl`}
                        type="button"
                        onClick={isMenuOpen ? closeMenu : openMenu}
                    >
                        <HiMenu />
                    </button>
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

                            <SearchDateFieldInput
                                label="From"
                                value={fromDate}
                                onChange={(value) => setFromDate(value)}
                            />

                            <SearchDateFieldInput
                                label="To"
                                value={toDate}
                                onChange={(value) => setToDate(value)}
                            />

                            <div>
                                <p className="mb-1">Author</p>
                                <div className="dark:bg-darkBg bg-lightBgSoft relative rounded-lg p-1 shadow-lg">
                                    <HintedSearchField
                                        placeholder="Search"
                                        value={username}
                                        onChange={setUsername}
                                        fetchHints={searchUsers}
                                        onSubmit={handleSubmit}
                                    />

                                    <button
                                        type="submit"
                                        className="absolute top-2 right-2 cursor-pointer"
                                    >
                                        <FaSearch />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
}
