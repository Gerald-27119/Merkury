export default interface LoadingState {
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    loadMoreRef: React.RefObject<HTMLDivElement>;
    message?: string;
}
