
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGameDetails, getDealsList } from '../services/cheapSharkService';
import { getSteamGameDetails, getSteamReviewSummary } from '../services/steamService';
import { GameDetails, StoreInfo, Deal, SteamGameDetails, SteamReviewSummary } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { ThumbUpIcon } from './icons/ThumbUpIcon';
import { ThumbDownIcon } from './icons/ThumbDownIcon';
import { PriceHistoryChart } from './PriceHistoryChart';

interface GameListItemExpandedProps {
    gameId: string;
    deal: Deal;
    stores: StoreInfo[];
    currency: string;
    currencySymbol: string;
}

const getMetacriticColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
};


const OtherDealRow: React.FC<{ deal: Deal; storeName: string; currencySymbol: string; storeLow: string; }> = ({ deal, storeName, currencySymbol, storeLow }) => {
    const savings = parseFloat(deal.savings);

    return (
        <a href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center text-sm py-1.5 hover:bg-slate-700/50 -mx-2 px-2 rounded-md">
            <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">{storeName}</span>
                <span className="text-rose-400">♡</span>
            </div>
            <div className="flex items-center gap-2">
                {storeLow && <span className="text-xs text-slate-400" title="Lowest historical price at this store">store low: {currencySymbol}{storeLow}</span>}
                {savings > 0 && <span className="text-xs font-bold text-green-400 bg-green-900/50 px-1.5 py-0.5 rounded" title="Discount percentage">-{Math.round(savings)}%</span>}
                <span className="font-bold text-base text-white">{currencySymbol}{deal.salePrice}</span>
            </div>
        </a>
    )
}

export const GameListItemExpanded: React.FC<GameListItemExpandedProps> = ({ gameId, deal, stores, currency, currencySymbol }) => {
    const [details, setDetails] = useState<GameDetails | null>(null);
    const [steamDetails, setSteamDetails] = useState<SteamGameDetails | null>(null);
    const [steamReviews, setSteamReviews] = useState<SteamReviewSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const gameDetails = await getGameDetails(gameId);
                setDetails(gameDetails);

                if (gameDetails.info.steamAppID) {
                    const [steam, reviews] = await Promise.all([
                        getSteamGameDetails(gameDetails.info.steamAppID),
                        getSteamReviewSummary(gameDetails.info.steamAppID)
                    ]);
                    setSteamDetails(steam);
                    setSteamReviews(reviews);
                }
            } catch (err) {
                setError('Could not load game details.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [gameId]);
    
    const title = steamDetails?.name || details?.info.title || deal.title;
    const allTags = [...(steamDetails?.genres || []), ...(steamDetails?.categories || [])];
    const uniqueTags = Array.from(new Set(allTags.map(tag => tag.description)))
      .map(description => allTags.find(tag => tag.description === description))
      .filter(Boolean).slice(0, 5);
      
    const mainImage = steamDetails?.screenshots?.[0]?.path_full || steamDetails?.header_image || deal.thumb;
    const otherImages = steamDetails?.screenshots?.slice(1, 3) || [];
    
    const steamReviewPercentage = steamReviews ? Math.round((steamReviews.total_positive / steamReviews.total_reviews) * 100) : null;

    if (isLoading) {
        return <div className="p-8 flex justify-center items-center"><SpinnerIcon className="w-8 h-8 text-slate-400"/></div>
    }
    if (error) {
        return <div className="p-8 text-center text-red-400">{error}</div>
    }
    if (!details) {
        return null;
    }

    return (
        <div className="p-4 bg-slate-800 animate-fade-in">
            <div className="border-b border-slate-700 pb-4 mb-4">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-wrap gap-2">
                        {uniqueTags.map(tag => (
                            <span key={tag!.id} className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded">{tag!.description}</span>
                        ))}
                    </div>
                </div>
            </div>

            <PriceHistoryChart normalPrice={parseFloat(deal.normalPrice)} salePrice={parseFloat(deal.salePrice)} />

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mt-4">
                <div>
                     <div className="grid grid-rows-2 grid-cols-1 gap-2 h-full">
                        <div className="row-span-2 rounded-lg overflow-hidden">
                             <img src={mainImage} alt="Main screenshot" className="w-full h-full object-cover"/>
                        </div>
                        {otherImages.map((img, i) => (
                             <div key={img.id} className="rounded-lg overflow-hidden hidden md:block">
                                <img src={img.path_thumbnail} alt={`Screenshot ${i+1}`} className="w-full h-full object-cover"/>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {steamReviewPercentage !== null && (
                        <div className="flex items-center justify-between text-sm bg-slate-700/50 p-3 rounded-lg" title={`${steamReviews?.review_score_desc} based on ${steamReviews?.total_reviews.toLocaleString()} reviews on Steam`}>
                            <span className="font-bold text-white">Steam</span>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <ThumbUpIcon className="w-4 h-4 text-green-400" /> 
                                    <span className="text-slate-200">{steamReviewPercentage}%</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <ThumbDownIcon className="w-4 h-4 text-red-400" />
                                    <span className="text-slate-200">{100 - steamReviewPercentage}%</span>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400">{steamReviews?.total_reviews.toLocaleString()} reviews</span>
                        </div>
                    )}
                    
                    {steamDetails?.metacritic && (
                        <div className="flex items-center justify-between text-sm bg-slate-700/50 p-3 rounded-lg" title="Metacritic score based on critic reviews">
                            <span className="font-bold text-white">Metascore</span>
                            <span className={`${getMetacriticColor(steamDetails.metacritic.score)} text-white font-bold px-2 rounded`}>{steamDetails.metacritic.score}</span>
                        </div>
                    )}
                    
                     <div className="bg-slate-700/50 p-3 rounded-lg">
                        {details.deals.slice(0, 5).map(d => (
                           <OtherDealRow 
                             key={d.dealID}
                             deal={d}
                             storeName={stores.find(s => s.storeID === d.storeID)?.storeName || 'Unknown Store'}
                             currencySymbol={currencySymbol}
                             storeLow={details.cheapestPriceEver.price}
                           />
                        ))}
                        <Link to={`/game/${gameId}`} className="w-full mt-2 block text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors" title="View full details for this game">
                            More on game page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};