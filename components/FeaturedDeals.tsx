import React from 'react';
import { Link } from 'react-router-dom';
import { Deal } from '../types';
import { HeartIcon } from './icons/HeartIcon';

interface FeaturedDealsProps {
    deals: Deal[];
    currencySymbol: string;
}

const FeaturedCard: React.FC<{deal: Deal, currencySymbol: string}> = ({ deal, currencySymbol }) => {
    const { steamAppID, title, gameID, salePrice, savings } = deal;
    const imageSrc = (steamAppID && steamAppID !== '0')
        ? `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppID}/header.jpg`
        : deal.thumb;
    
    return (
        <Link 
            to={`/game/${gameID}`}
            className="group relative aspect-[16/9] w-full rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
        >
             <img 
                src={imageSrc} 
                alt={title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => { e.currentTarget.src = deal.thumb; }}
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
             <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-xl tracking-wide leading-tight line-clamp-2" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    {title}
                </h3>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                         <span className="px-3 py-1 bg-green-500/80 text-white text-sm font-bold rounded-md shadow-lg">
                            -{Math.round(parseFloat(savings))}%
                        </span>
                        <p className="text-xl font-bold text-white bg-black/50 backdrop-blur-sm px-3 py-0.5 rounded-md border border-white/20">
                            {currencySymbol}{salePrice}
                        </p>
                    </div>
                    <HeartIcon className="w-6 h-6 text-white/80" />
                </div>
            </div>
        </Link>
    )
}

export const FeaturedDeals: React.FC<FeaturedDealsProps> = ({ deals, currencySymbol }) => {
    if (!deals || deals.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {deals.map(deal => (
                <FeaturedCard key={deal.dealID} deal={deal} currencySymbol={currencySymbol} />
           ))}
        </div>
    );
};