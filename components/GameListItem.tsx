
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Deal, StoreInfo } from '../types';
import { FlameIcon } from './icons/FlameIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { SteamIcon } from './icons/SteamIcon';
import { WindowsIcon } from './icons/WindowsIcon';
import { AppleIcon } from './icons/AppleIcon';
import { formatDate } from '../utils/formatDate';

interface GameListItemProps {
    deal: Deal;
    currencySymbol: string;
    store: StoreInfo | undefined;
    isExpanded: boolean;
    onToggleExpand: (dealId: string) => void;
}

export const GameListItem: React.FC<GameListItemProps> = ({ deal, currencySymbol, store, isExpanded, onToggleExpand }) => {
    const { steamAppID, title, gameID, salePrice, normalPrice, savings, releaseDate } = deal;
    const navigate = useNavigate();
    
    const imageSrc = (steamAppID && steamAppID !== '0')
        ? `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppID}/header.jpg`
        : deal.thumb;

    const hasSavings = savings && parseFloat(savings) > 0;
    const hasNormalPrice = normalPrice && parseFloat(normalPrice) > 0 && parseFloat(normalPrice) > parseFloat(salePrice);
    
    const handleExpandClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleExpand(deal.dealID);
    };

    const handleNavigate = () => {
        navigate(`/game/${gameID}`);
    };

    return (
        <div className="border-b border-slate-700/50 last:border-b-0">
             <div 
                onClick={handleNavigate}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 p-2 hover:bg-slate-700/30 transition-colors duration-200 cursor-pointer"
            >
                {/* Image */}
                <img 
                    src={imageSrc} 
                    alt={title} 
                    className="w-32 h-auto aspect-[16/9] object-cover rounded-md flex-shrink-0"
                    onError={(e) => { e.currentTarget.src = deal.thumb; }}
                />
                
                {/* Title & Platforms */}
                <div className="flex-grow min-w-0 pr-4">
                    <p className="font-semibold text-white truncate" title={title}>{title}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                       {steamAppID && <>
                            <WindowsIcon className="w-4 h-4" title="Available on Windows"/>
                            <AppleIcon className="w-4 h-4" title="Available on macOS"/>
                       </>}
                       {store?.storeName === 'Steam' && <SteamIcon className="w-4 h-4" title="Available on Steam" />}
                       <span className="font-semibold" title="Store">{store?.storeName}</span>
                       <span className="text-slate-500">&middot;</span>
                       <span title="Release Date">{formatDate(releaseDate)}</span>
                    </div>
                </div>

                {/* Price Info */}
                <div className="text-right flex-shrink-0 w-40">
                    <div className="flex items-center justify-end gap-2">
                        {hasSavings && (
                             <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-md" title="Discount Percentage">
                                -{Math.round(parseFloat(savings))}%
                            </span>
                        )}
                         <p className="font-bold text-lg text-white" title="Current Price">
                             {currencySymbol}{salePrice}
                         </p>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-1">
                        <span className="text-xs text-slate-400" title="Store">{store?.storeName || ''} <span className="text-rose-400">♡</span></span>
                         {hasNormalPrice && (
                            <span className="text-slate-500 line-through text-xs" title="Original Price">{currencySymbol}{normalPrice}</span>
                        )}
                    </div>
                </div>

                {/* Heat Icon */}
                <button className="p-2 rounded-full text-slate-400 hover:bg-slate-600/50 hover:text-orange-400 transition-colors" title={`Deal Rating: ${deal.dealRating}`} aria-label="Deal score">
                    <FlameIcon className="w-5 h-5" />
                </button>
                
                {/* More Options */}
                 <button 
                    onClick={handleExpandClick}
                    className={`p-2 rounded-full text-slate-400 hover:bg-slate-600/50 hover:text-white transition-colors ${isExpanded ? 'bg-slate-600/50 text-white' : ''}`}
                    aria-label="More options"
                    title="Show more details"
                >
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </div>
    );
};