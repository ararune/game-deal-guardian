
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { GameListItem } from './GameListItem';
import { StoreInfo, Deal, GameLookup, WishlistItem, GameDetails } from '../types';
import { GameListItemExpanded } from './GameListItemExpanded';

interface WishlistViewProps {
    stores: StoreInfo[];
    currency: string;
    storePlatformMap: Record<string, string>;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ stores, currency, storePlatformMap }) => {
    const { wishlist } = useWishlist();
    const [expandedDealId, setExpandedDealId] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleToggleExpand = (dealId: string) => {
        setExpandedDealId(prevId => (prevId === dealId ? null : dealId));
    };
    
    const handleGameSelect = (gameId: string) => {
        navigate(`/game/${gameId}`);
    };

    const currencySymbolMap: Record<string, string> = {
        USD: '$', EUR: '€', GBP: '£', CAD: 'C$'
    };

    if (wishlist.length === 0) {
        return (
            <div className="text-center py-16 bg-slate-800/50 rounded-lg border border-slate-700">
                <h2 className="text-2xl font-semibold text-gray-300 mb-2">Your Wishlist is Empty</h2>
                <p className="text-gray-500">Add games from the deals page to track their prices here.</p>
            </div>
        );
    }
    
    const mapWishlistItemToDeal = (item: WishlistItem): Deal => {
        if ('info' in item) { // GameDetails
            const gameDetailsItem = item as GameDetails;
            const bestDeal = gameDetailsItem.deals.reduce((best, current) => {
                return parseFloat(current.salePrice) < parseFloat(best.salePrice) ? current : best;
            }, gameDetailsItem.deals[0]);

            if (bestDeal) return bestDeal;

            return {
                gameID: gameDetailsItem.deals[0]?.gameID || '',
                thumb: gameDetailsItem.info.thumb,
                title: gameDetailsItem.info.title,
                salePrice: gameDetailsItem.cheapestPriceEver.price,
                normalPrice: '0',
                steamAppID: gameDetailsItem.info.steamAppID,
            } as Deal;
        }
        if ('cheapest' in item) { // GameLookup
            const gameLookupItem = item as GameLookup;
            return {
                gameID: gameLookupItem.gameID,
                thumb: gameLookupItem.thumb,
                title: gameLookupItem.external,
                salePrice: gameLookupItem.cheapest,
                normalPrice: '0',
                steamAppID: gameLookupItem.steamAppID,
            } as Deal;
        }
        return item as Deal;
    }
    
    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">My Wishlist</h2>
            <div className="bg-slate-800/50 rounded-lg border border-slate-700">
                {wishlist.map((item, index) => {
                   const dealItem = mapWishlistItemToDeal(item);
                   if (!dealItem.gameID) return null;
                   const currencySymbol = currencySymbolMap[currency] || '$';

                   return (
                     <React.Fragment key={`${dealItem.gameID}-${index}`}>
                        <GameListItem 
                            deal={dealItem} 
                            currencySymbol={currencySymbol}
                            store={stores.find(s => s.storeID === dealItem.storeID)}
                            isExpanded={expandedDealId === dealItem.dealID}
                            onToggleExpand={handleToggleExpand}
                        />
                        {expandedDealId === dealItem.dealID && (
                            <GameListItemExpanded 
                                gameId={dealItem.gameID}
                                deal={dealItem}
                                stores={stores}
                                currency={currency}
                                currencySymbol={currencySymbol}
                            />
                        )}
                    </React.Fragment>
                   )
                })}
            </div>
        </div>
    );
};