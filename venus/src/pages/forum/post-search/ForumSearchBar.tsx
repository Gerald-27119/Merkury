import { HiMenu } from "react-icons/hi";
import React, { useState } from "react";
import { useBoolean } from "../../../hooks/useBoolean";
import { searchPosts } from "../../../http/posts";
import { useNavigate } from "react-router-dom";
import PostCategoryDto from "../../../model/interface/forum/postCategoryDto";
import TagDto from "../../../model/interface/tagDto";
import SelectWithSearch from "../components/SelectWithSearch";
import Option from "../../../model/interface/forum/selectOption";
import SearchDateFieldInput from "./SearchDateFieldInput";
import HintedSearchField from "./HintedSearchField";
import { searchUsers } from "../../../http/user";
import { FaSearch } from "react-icons/fa";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import {notificationAction} from "../../../redux/notification";

interface ForumSearchBarProps {
    categories: PostCategoryDto[];
    tags: TagDto[];
}

interface SearchState {
    searchPhrase: string;
    username: string;
    searchCategory: Option | null;
    searchTags: Option[];
    fromDate: string;
    toDate: string;
}

export default function ForumSearchBar({
    categories,
    tags,
}: ForumSearchBarProps) {
    const [searchState, setSearchState] = useState<SearchState>({
        searchPhrase: "",
        username: "",
        searchCategory: null,
        searchTags: [],
        fromDate: "",
        toDate: "",
    });

    const [isMenuOpen, openMenu, closeMenu] = useBoolean();

    const navigate = useNavigate();
    const dispatch = useDispatchTyped();

    const categoryOptions = categories.map((category) => ({
        value: category.name,
        label: category.name,
    }));

    const tagOptions = tags.map((tag) => ({
        value: tag.name,
        label: tag.name,
    }));

    const validateDate = () => {
        if (
            searchState.fromDate &&
            searchState.toDate &&
            new Date(searchState.toDate) < new Date(searchState.fromDate)
        ) {
            dispatch(
                notificationAction.addError({
                    message: '"To" Date cannot be before "From" Date',
                })
            );
            return false;
        }
        return true;
    }

    const handleChange = <T extends keyof SearchState>(
        key: T,
        value: SearchState[T],
    ) => {
        setSearchState((prev) => ({ ...prev, [key]: value }));
    };

    const handleClear = () => {
        setSearchState({
            searchPhrase: "",
            username: "",
            searchCategory: null,
            searchTags: [],
            fromDate: "",
            toDate: "",
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateDate()) return;

        const params = new URLSearchParams();
        if (searchState.searchPhrase) params.set("q", searchState.searchPhrase);
        if (searchState.searchCategory)
            params.set("category", searchState.searchCategory.value);
        if (searchState.searchTags?.length)
            searchState.searchTags.forEach((tag) =>
                params.append("tags", tag.value),
            );
        if (searchState.fromDate) params.set("from", searchState.fromDate);
        if (searchState.toDate) params.set("to", searchState.toDate);
        if (searchState.username) params.set("author", searchState.username);

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
                        value={searchState.searchPhrase}
                        onChange={(val) => handleChange("searchPhrase", val)}
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
                                    value={searchState.searchCategory}
                                    isClearable={true}
                                    onChange={(val) =>
                                        handleChange("searchCategory", val)
                                    }
                                    variant="search"
                                />
                            </div>

                            <div>
                                <p className="mb-1">Tags</p>
                                <SelectWithSearch
                                    placeholder=""
                                    isMultiChoice={true}
                                    options={tagOptions}
                                    value={searchState.searchTags}
                                    isClearable={false}
                                    onChange={(val) =>
                                        handleChange("searchTags", val)
                                    }
                                    variant="search"
                                />
                            </div>

                            <SearchDateFieldInput
                                label="From"
                                value={searchState.fromDate}
                                onChange={(val) =>
                                    handleChange("fromDate", val)
                                }
                            />

                            <SearchDateFieldInput
                                label="To"
                                value={searchState.toDate}
                                onChange={(val) => handleChange("toDate", val)}
                            />

                            <div>
                                <p className="mb-1">Author</p>
                                <div className="dark:bg-darkBg bg-lightBgSoft relative h-[1.875rem] rounded-lg p-1 shadow-lg">
                                    <HintedSearchField
                                        placeholder="Search"
                                        value={searchState.username}
                                        onChange={(val) =>
                                            handleChange("username", val)
                                        }
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

                            <div className="mt-6 flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="flex-1 cursor-pointer rounded bg-gray-300 p-1 text-gray-700 hover:bg-gray-400"
                                >
                                    Clear
                                </button>
                                <button
                                    type="submit"
                                    className="dark:bg-violetDark bg-violetLight/80 dark:hover:bg-violetDarker hover:bg-violetLight flex-1 cursor-pointer rounded p-1 text-white"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
}
