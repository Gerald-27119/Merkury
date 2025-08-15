export interface TrendingGifCategory {
    searchTerm: string;
    path: string;
    gifUrl: string;
}

export interface SearchedGifs {
    gifs: SearchedGif[];
    next: string;
}

export interface SearchedGif {
    url: string;
}
