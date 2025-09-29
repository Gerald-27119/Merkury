import React, { ReactNode } from "react";
import AddPostButton from "./AddPostButton";
import ForumCategoriesTagsPanel from "../categories-and-tags/components/ForumCategoriesTagsPanel";
import ForumSearchBar from "./ForumSearchBar";
import RightPanel from "./RightPanel";
import ForumFormModal from "./ForumFormModal";
import { useQuery } from "@tanstack/react-query";
import { fetchCategoriesAndTags } from "../../../http/posts";
import { notificationAction } from "../../../redux/notification";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { useBoolean } from "../../../hooks/useBoolean";

interface ForumLayoutProps {
    children: ReactNode;
}

export default function ForumLayout({ children }: ForumLayoutProps) {
    const isLogged = useSelector((state: RootState) => state.account.isLogged);
    const dispatch = useDispatchTyped();
    const [isModalOpen, setIsModalOpenToTrue, setIsModalOpenToFalse] =
        useBoolean(false);

    const {
        data: categoriesAndTags,
        isLoading: isCatTagsLoading,
        isError: isCatTagsError,
        error: catTagsError,
    } = useQuery({
        queryKey: ["categoriesAndTags"],
        queryFn: () => fetchCategoriesAndTags(),
    });

    const handleAddPostClick = () => {
        if (isLogged) {
            setIsModalOpenToTrue();
        } else {
            dispatch(
                notificationAction.addInfo({
                    message: "Login to create posts.",
                }),
            );
        }
    };

    return (
        <div className="dark:bg-darkBg dark:text-darkText text-lightText bg-lightBg min-h-screen w-full">
            <div className="mx-auto mt-8 flex w-full max-w-6xl flex-row gap-4">
                <div className="sticky-forum-panel">
                    <AddPostButton onClick={handleAddPostClick} />

                    <ForumCategoriesTagsPanel
                        data={categoriesAndTags}
                        isLoading={isCatTagsLoading}
                        isError={isCatTagsError}
                        error={catTagsError}
                    />
                </div>

                <div>{children}</div>

                <div className="sticky-forum-panel">
                    <ForumSearchBar />
                    <RightPanel />
                </div>
                <ForumFormModal
                    onClose={setIsModalOpenToFalse}
                    isOpen={isModalOpen}
                    categories={categoriesAndTags?.categories ?? []}
                    tags={categoriesAndTags?.tags ?? []}
                />
            </div>
        </div>
    );
}
