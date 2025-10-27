


import React from 'react';
import { GameLookup } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface SearchSuggestionsProps {
    suggestions: GameLookup[];
    isLoading: boolean;
    onSelect: (game: GameLookup) => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ suggestions, isLoading, onSelect }) => {
    return (
        <div className="absolute top-full mt-2 w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            {isLoading && (
                <div className="flex justify-center items-center p-4">
                    <SpinnerIcon className="w-6 h-6 text-slate-400" />
                </div>
            )}
            {!isLoading && suggestions.length === 0 && (
                <p className="text-gray-400 text-sm text-center p-4">No games found.</p>
            )}
            {!isLoading && suggestions.length > 0 && (
                <ul>
                    {suggestions.map(game => {
                        const imageSrc = (game.steamAppID && game.steamAppID !== '0')
                            ? `https://cdn.akamai.steamstatic.com/steam/apps/${game.steamAppID}/header.jpg` 
                            : game.thumb;
                        
                        return (
                            <li key={game.gameID}>
                                <button 
                                    onClick={() => onSelect(game)}
                                    className="w-full text-left flex items-center gap-3 p-2 hover:bg-slate-700/70 transition-colors"
                                >
                                    <img 
                                        src={imageSrc} 
                                        alt={game.external} 
                                        className="w-20 h-auto aspect-[16/9] object-cover rounded"
                                        onError={(e) => { e.currentTarget.src = game.thumb; }}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-white font-semibold text-sm">{game.external}</span>
                                        <span className="text-xs text-slate-400">Best Price: ${game.cheapest}</span>
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};