
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { WishlistItem, GameDetails, GameLookup, Deal } from '../types';

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (game: WishlistItem) => void;
    removeFromWishlist: (gameId: string) => void;
    isInWishlist: (gameId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const getGameId = (item: WishlistItem): string => {
    if ('info' in item) { // GameDetails
        return item.deals[0]?.gameID || '';
    }
    return item.gameID; // GameLookup or Deal
};


export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
        try {
            const items = window.localStorage.getItem('gameDealWishlist');
            return items ? JSON.parse(items) : [];
        } catch (error) {
            console.error("Error reading wishlist from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('gameDealWishlist', JSON.stringify(wishlist));
        } catch (error) {
            console.error("Error saving wishlist to localStorage", error);
        }
    }, [wishlist]);

    const addToWishlist = (game: WishlistItem) => {
        setWishlist((prev) => [...prev, game]);
    };

    const removeFromWishlist = (gameId: string) => {
        setWishlist((prev) => prev.filter((item) => getGameId(item) !== gameId));
    };

    const isInWishlist = (gameId: string) => {
        return wishlist.some((item) => getGameId(item) === gameId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = (): WishlistContextType => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
