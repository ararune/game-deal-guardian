
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameDetails as getCheapSharkDetails, getDealsList } from '../services/cheapSharkService';
import { getSteamGameDetails, getSteamReviewSummary } from '../services/steamService';
import { GameDetails, StoreInfo, Deal, SteamGameDetails, SteamReviewSummary } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { HeartIcon } from './icons/HeartIcon';
import { useWishlist } from '../context/WishlistContext';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SteamIcon } from './icons/SteamIcon';
import { GOGIcon } from './icons/GOGIcon';
import { EpicGamesIcon } from './icons/EpicGamesIcon';
import { PCIcon } from './icons/PCIcon';
import { PlayStationIcon } from './icons/PlayStationIcon';
import { XboxIcon } from './icons/XboxIcon';
import { MetacriticIcon } from './icons/MetacriticIcon';
import { DeveloperIcon } from './icons/DeveloperIcon';
import { PublisherIcon } from './icons/PublisherIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { UpdateIcon } from './icons/UpdateIcon';
import { ReviewsIcon } from './icons/ReviewsIcon';
import { ThumbUpIcon } from './icons/ThumbUpIcon';
import { ThumbDownIcon } from './icons/ThumbDownIcon';

interface GameDetailsViewProps {
    gameId: string;
    stores: StoreInfo[];
    currency: string;
    currencySymbol: string;
    storePlatformMap: Record<string, string>;
}


const getMetacriticColor = (score: number) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
};

const StoreDealRow: React.FC<{ deal: Deal; stores: StoreInfo[]; currencySymbol: string; platform: string | null; }> = ({ deal, stores, currencySymbol, platform }) => {
    const savings = parseFloat(deal.savings);
    const dealUrl = `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`;
    const store = stores.find(s => s.storeID === deal.storeID);

    const PlatformStoreIcon = () => {
        const iconProps = { className: "w-6 h-6 text-gray-300 flex-shrink-0" };
        const storeId = deal.storeID;
        if (platform === 'pc') {
            switch (storeId) {
                case '1': return <SteamIcon {...iconProps} title="Steam" />;
                case '7': return <GOGIcon {...iconProps} title="GOG" />;
                case '11': return <EpicGamesIcon {...iconProps} title="Epic Games" />;
                default: return <PCIcon {...iconProps} title="PC" />;
            }
        }
    
        switch(platform) {
            case 'playstation': return <PlayStationIcon {...iconProps} title="PlayStation" />;
            case 'xbox': return <XboxIcon {...iconProps} title="Xbox" />;
            default: return <PCIcon {...iconProps} title="PC" />;
        }
    }


    return (
        <a 
            href={dealUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            title="Click to go to the store page for this deal"
            className="grid grid-cols-6 items-center gap-4 p-4 bg-slate-800/60 hover:bg-slate-700/80 rounded-lg transition-all duration-300 border border-slate-700 hover:border-slate-600"
        >
            <div className="col-span-6 sm:col-span-3 flex items-center gap-4 min-w-0">
                <PlatformStoreIcon />
                <span className="font-semibold text-gray-200 tracking-wide truncate">{store?.storeName || 'Unknown Store'}</span>
            </div>
            <div className="col-span-3 sm:col-span-1 text-center">
                 {savings > 0 && (
                     <span className="text-sm font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-md" title="Discount percentage">{Math.round(savings)}% OFF</span>
                )}
            </div>
            <div className="col-span-3 sm:col-span-2 text-right">
                {parseFloat(deal.normalPrice) > parseFloat(deal.salePrice) && 
                    <p className="text-sm text-slate-500 line-through" title="Original price">{currencySymbol}{deal.normalPrice}</p>
                }
                <p className="text-xl font-bold text-white" title="Current sale price">{currencySymbol}{deal.salePrice}</p>
            </div>
        </a>
    );
};

export const GameDetailsView: React.FC<GameDetailsViewProps> = ({ gameId, stores, currency, currencySymbol, storePlatformMap }) => {
    const [cheapSharkDetails, setCheapSharkDetails] = useState<GameDetails | null>(null);
    const [steamDetails, setSteamDetails] = useState<SteamGameDetails | null>(null);
    const [steamReviews, setSteamReviews] = useState<SteamReviewSummary | null>(null);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const csDetails = await getCheapSharkDetails(gameId);
                setCheapSharkDetails(csDetails);

                let primaryAppId = csDetails.info.steamAppID;
                
                let steamDetailsResult = primaryAppId ? await getSteamGameDetails(primaryAppId) : null;
                if (!steamDetailsResult) {
                     console.warn("Primary Steam App ID failed or was missing. Attempting fallback...");
                     const steamDeals = await getDealsList({ title: csDetails.info.title, storeIDs: '1', pageSize: 1 });
                     const fallbackAppID = steamDeals[0]?.steamAppID;
                     if (fallbackAppID) {
                         console.log(`Found fallback Steam App ID: ${fallbackAppID}`);
                         primaryAppId = fallbackAppID;
                         steamDetailsResult = await getSteamGameDetails(fallbackAppID);
                     } else {
                         console.warn("Fallback failed to find a valid Steam App ID.");
                     }
                }
                setSteamDetails(steamDetailsResult);
                
                const dealsPromise = getDealsList({
                    steamAppID: primaryAppId ?? undefined,
                    title: csDetails.info.title,
                    currency
                });
                
                const reviewsPromise = primaryAppId
                    ? getSteamReviewSummary(primaryAppId)
                    : Promise.resolve(null);
                
                const [currencyDeals, reviewsResult] = await Promise.all([dealsPromise, reviewsPromise]);
                
                setDeals(currencyDeals.length > 0 ? currencyDeals : csDetails.deals);
                setSteamReviews(reviewsResult);

            } catch (err) {
                console.error("Error fetching game details:", err);
                setError('Failed to load game details.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllDetails();
    }, [gameId, currency]);

    const handleWishlistToggle = () => {
        if (!cheapSharkDetails) return;
        const reliableGameId = cheapSharkDetails.deals[0]?.gameID || gameId;
        if (isInWishlist(reliableGameId)) {
            removeFromWishlist(reliableGameId);
        } else {
            addToWishlist(cheapSharkDetails);
        }
    };
    
    const reliableGameId = cheapSharkDetails?.deals[0]?.gameID || gameId;
    const isWishlisted = isInWishlist(reliableGameId);

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><SpinnerIcon className="w-12 h-12 text-slate-400" /></div>;
    }
    if (error || !cheapSharkDetails) {
        return <div className="text-center text-red-400 p-8">{error || 'Game not found.'}</div>;
    }

    const title = steamDetails?.name || cheapSharkDetails.info.title;
    const backgroundImage = steamDetails?.header_image || cheapSharkDetails.info.thumb;
    
    const mostRecentDeal = [...deals, ...cheapSharkDetails.deals].sort((a, b) => b.lastChange - a.lastChange)[0];
    const lastChangeTimestamp = mostRecentDeal?.lastChange;
    const lastUpdateDate = lastChangeTimestamp && lastChangeTimestamp > 0
        ? new Date(lastChangeTimestamp * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : null;

    const allTags = [...(steamDetails?.genres || []), ...(steamDetails?.categories || [])];
    const uniqueTags = Array.from(new Set(allTags.map(tag => tag.description)))
      .map(description => {
        return allTags.find(tag => tag.description === description);
      }).filter(Boolean);


    return (
        <div className="w-full mx-auto animate-fade-in relative">
            {/* Blurred Background */}
            <div className="fixed inset-0 -z-20">
                <div style={{ backgroundImage: `url(${backgroundImage})` }} className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 scale-110" />
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-3xl" />
            </div>
            
            <button onClick={() => navigate(-1)} className="sticky top-20 flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors mb-6 backdrop-blur-sm bg-black/30 p-2 rounded-lg z-10">
                <ArrowLeftIcon className="w-5 h-5" />
                Back
            </button>
            
            {/* Hero Section */}
            <div className="relative w-full h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden flex flex-col justify-end shadow-2xl border border-white/10">
                <img src={backgroundImage} alt={title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
                <div className="relative p-6 md:p-10 space-y-4">
                    {uniqueTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {uniqueTags.slice(0, 5).map(tag => ( // Limit tags to prevent overflow
                                <span key={tag!.id} className="text-xs font-semibold backdrop-blur-sm bg-white/10 text-slate-200 px-3 py-1.5 rounded-full">{tag!.description}</span>
                            ))}
                        </div>
                    )}
                    <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-wider" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{title}</h1>
                    <button 
                        onClick={handleWishlistToggle} 
                        title={isWishlisted ? 'Remove from your wishlist' : 'Add to your wishlist'}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 border text-sm ${isWishlisted ? 'bg-red-500/80 hover:bg-red-500 border-red-400/80 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white/20 text-gray-200'}`}>
                        <HeartIcon className={`w-5 h-5 ${isWishlisted ? 'fill-current' : 'stroke-current'}`} />
                        {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-12 px-2 md:px-8 space-y-12">
                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center md:text-left">
                     {steamDetails?.metacritic?.score && (
                        <InfoItem 
                            icon={<MetacriticIcon className={`w-6 h-6 ${getMetacriticColor(steamDetails.metacritic.score)}`} />} 
                            label="Metascore" 
                            value={steamDetails.metacritic.score.toString()} 
                        />
                    )}
                     {steamReviews && <ReviewStatsItem reviews={steamReviews} />}
                    {steamDetails?.release_date?.date && 
                        <InfoItem 
                            icon={<CalendarIcon className="w-6 h-6 text-slate-400"/>}
                            label="Release Date" 
                            value={steamDetails.release_date.date}
                        />
                    }
                    {lastUpdateDate && 
                        <InfoItem 
                            icon={<UpdateIcon className="w-6 h-6 text-slate-400"/>}
                            label="Last Update" 
                            value={lastUpdateDate}
                        />
                    }
                    {steamDetails?.developers && 
                         <InfoItem 
                            icon={<DeveloperIcon className="w-6 h-6 text-slate-400"/>}
                            label="Developer" 
                            value={steamDetails.developers.join(', ')}
                        />
                    }
                     {steamDetails?.publishers && 
                        <InfoItem 
                            icon={<PublisherIcon className="w-6 h-6 text-slate-400"/>}
                            label="Publisher" 
                            value={steamDetails.publishers.join(', ')}
                        />
                    }
                </div>

                {/* Description */}
                {steamDetails && (
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4 border-b-2 border-slate-700 pb-2">About This Game</h2>
                        <div className="prose prose-sm prose-invert text-slate-300 max-w-none prose-p:text-slate-300 prose-a:text-sky-400" dangerouslySetInnerHTML={{ __html: steamDetails.about_the_game }} />
                    </div>
                )}
                
                {/* Deals List */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-4 border-b-2 border-slate-700 pb-2">Current Deals ({currency})</h2>
                    <div className="space-y-3">
                        {deals.length > 0 ? deals.sort((a,b) => parseFloat(a.salePrice) - parseFloat(b.salePrice)).map(deal => (
                            <StoreDealRow 
                                key={deal.dealID} 
                                deal={deal} 
                                stores={stores} 
                                currencySymbol={currencySymbol}
                                platform={storePlatformMap[deal.storeID]}
                            />
                        )) : <p className="text-gray-400 p-8 text-center bg-slate-800/50 rounded-lg">No deals found in {currency}.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem: React.FC<{icon: React.ReactNode, label: string, value: string | undefined}> = ({icon, label, value}) => {
    if (!value) return null;
    return (
        <div className="flex flex-col items-center md:items-start" title={`${label}: ${value}`}>
            <div className="flex items-center gap-2 text-sm text-slate-400">
                {icon}
                <span className="font-semibold">{label}</span>
            </div>
            <p className="text-xl font-bold text-white mt-1">{value}</p>
        </div>
    );
};

const ReviewStatsItem: React.FC<{ reviews: SteamReviewSummary }> = ({ reviews }) => {
    return (
        <div className="flex flex-col items-center md:items-start col-span-2 md:col-span-1" title={`Based on ${reviews.total_reviews.toLocaleString()} user reviews on Steam`}>
            <div className="flex items-center gap-2 text-sm text-slate-400">
                <ReviewsIcon className="w-6 h-6" />
                <span className="font-semibold">{reviews.review_score_desc}</span>
            </div>
            <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1.5" title="Positive Reviews">
                    <ThumbUpIcon className="w-5 h-5 text-green-400" />
                    <span className="text-lg font-bold text-white">{reviews.total_positive.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Negative Reviews">
                    <ThumbDownIcon className="w-5 h-5 text-red-400" />
                    <span className="text-lg font-bold text-white">{reviews.total_negative.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};