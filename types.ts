

export interface GameLookup {
    gameID: string;
    steamAppID: string | null;
    cheapest: string;
    cheapestDealID: string;
    external: string;
    internalName: string;
    thumb: string;
}

export interface Deal {
    internalName: string;
    title: string;
    metacriticLink: string | null;
    dealID: string;
    storeID: string;
    gameID: string;
    salePrice: string;
    normalPrice: string;
    isOnSale: string;
    savings: string;
    metacriticScore: string;
    steamRatingText: string | null;
    steamRatingPercent: string;
    steamRatingCount: string;
    steamAppID: string | null;
    releaseDate: number;
    lastChange: number;
    dealRating: string;
    thumb: string;
}

export interface StoreInfo {
    storeID: string;
    storeName: string;
    isActive: number;
    images: {
        banner: string;
        logo: string;
        icon: string;
    };
}

export interface GameInfo {
    title: string;
    steamAppID: string | null;
    thumb:string;
}

export interface CheapestPrice {
    price: string;
    date: number;
}

// Simplified GameDetails structure to reflect actual API response
export interface GameDetails {
    info: GameInfo;
    cheapestPriceEver: CheapestPrice;
    deals: Deal[];
}

// NEW: Detailed structure for Steam API response
export interface SteamGameDetails {
    name: string;
    steam_appid: number;
    detailed_description: string;
    about_the_game: string;
    short_description: string;
    header_image: string;
    developers: string[];
    publishers: string[];
    metacritic?: {
        score: number;
        url: string;
    };
    genres?: {
        id: string;
        description: string;
    }[];
    categories?: {
        id: number;
        description: string;
    }[];
    release_date: {
        coming_soon: boolean;
        date: string;
    };
    recommendations?: {
        total: number;
    };
    achievements?: {
        total: number;
        highlighted: { name: string; path: string; }[];
    };
    screenshots?: {
        id: number;
        path_thumbnail: string;
        path_full: string;
    }[];
    movies?: {
        id: number;
        name: string;
        thumbnail: string;
        webm: { 480: string; max: string; };
        mp4: { 480: string; max: string; };
        highlight: boolean;
    }[];
}

// NEW: Structure for Steam Review Summary
export interface SteamReviewSummary {
    num_reviews: number;
    review_score: number;
    review_score_desc: string;
    total_positive: number;
    total_negative: number;
    total_reviews: number;
}


// Update WishlistItem to potentially include full details for consistency
export type WishlistItem = GameLookup | Deal | GameDetails;