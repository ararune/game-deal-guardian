import { SteamGameDetails, SteamReviewSummary } from '../types';

// Using a more reliable, transparent CORS proxy to fetch from the Steam API on the client-side.
const CORS_PROXY_URL = 'https://corsproxy.io/?';
const STEAM_API_BASE_URL = 'https://store.steampowered.com/api/appdetails?appids=';
const STEAM_REVIEWS_API_URL = 'https://store.steampowered.com/appreviews/';


// Custom type guard to check for the success case of the Steam API response
const isSuccessfulDetailsResponse = (data: any): data is { [key: string]: { success: true; data: SteamGameDetails } } => {
    if (!data) return false;
    const firstKey = Object.keys(data)[0];
    return data[firstKey] && data[firstKey].success === true;
};

const isSuccessfulReviewsResponse = (data: any): data is { success: true; query_summary: SteamReviewSummary } => {
    return data && data.success === 1 && data.query_summary;
}

export const getSteamGameDetails = async (steamAppID: string): Promise<SteamGameDetails | null> => {
    try {
        const url = `${STEAM_API_BASE_URL}${steamAppID}`;
        const response = await fetch(`${CORS_PROXY_URL}${encodeURIComponent(url)}`);
        
        if (!response.ok) {
            console.warn(`CORS Proxy call failed for steamAppID ${steamAppID}: ${response.statusText}`);
            return null;
        }
        
        const contents = await response.json();

        if (!isSuccessfulDetailsResponse(contents)) {
            console.warn(`Steam API did not return successful data for appID: ${steamAppID}`);
            return null;
        }

        return contents[steamAppID].data;
    } catch (error) {
        console.error(`Error fetching or parsing Steam details for appID ${steamAppID}:`, error);
        return null;
    }
};


export const getSteamReviewSummary = async (steamAppID: string): Promise<SteamReviewSummary | null> => {
    try {
        const url = `${STEAM_REVIEWS_API_URL}${steamAppID}?json=1&language=all`;
        const response = await fetch(`${CORS_PROXY_URL}${encodeURIComponent(url)}`);

        if (!response.ok) {
            console.warn(`CORS Proxy call for reviews failed for steamAppID ${steamAppID}: ${response.statusText}`);
            return null;
        }

        const contents = await response.json();
        
        if (!isSuccessfulReviewsResponse(contents)) {
            console.warn(`Steam Reviews API did not return successful data for appID: ${steamAppID}`);
            return null;
        }
        
        return contents.query_summary;

    } catch (error) {
        console.error(`Error fetching or parsing Steam reviews for appID ${steamAppID}:`, error);
        return null;
    }
};