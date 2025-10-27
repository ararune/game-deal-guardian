
import { GameLookup, Deal, StoreInfo, GameDetails } from '../types';

const API_BASE_URL = 'https://www.cheapshark.com/api/1.0';

interface GetDealsListParams {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    desc?: boolean;
    storeIDs?: string;
    currency?: string;
    steamAppID?: string;
    title?: string;
    upperPrice?: string;
    savings?: string;
}

async function fetcher<T,>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
}

export const searchGamesByTitle = (title: string, limit: number = 60): Promise<GameLookup[]> => {
    return fetcher<GameLookup[]>(`/games?title=${encodeURIComponent(title)}&limit=${limit}`);
};

export const getGameDetails = (gameId: string): Promise<GameDetails> => {
    return fetcher<GameDetails>(`/games?id=${gameId}`);
};

export const getDealsList = (params: GetDealsListParams = {}): Promise<Deal[]> => {
    const { 
        pageNumber = 0, 
        pageSize = 30,
        sortBy = 'Deal Rating', 
        desc = true,
        storeIDs,
        currency = 'USD',
        steamAppID,
        title,
        upperPrice,
        savings,
    } = params;

    const query = new URLSearchParams({
        pageNumber: String(pageNumber),
        pageSize: String(pageSize),
        sortBy: sortBy,
        desc: String(desc),
    });

    if (storeIDs) {
        query.append('storeID', storeIDs);
    }
    if (currency) {
        query.append('currency', currency);
    }
    if (steamAppID) {
        query.append('steamAppID', steamAppID);
    }
    if (title) {
        query.append('title', title);
    }
    if (upperPrice) {
        query.append('upperPrice', upperPrice);
    }
    if (savings) {
        query.append('savings', savings);
    }
    
    return fetcher<Deal[]>(`/deals?${query.toString()}`);
};

export const getStoresInfo = (): Promise<StoreInfo[]> => {
    return fetcher<StoreInfo[]>('/stores');
};
