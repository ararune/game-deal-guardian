


import React, { FormEvent, useState, useRef, useEffect } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { SearchSuggestions } from './SearchSuggestions';
import { GameLookup } from '../types';

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onSearch: (term: string) => void;
    suggestions: GameLookup[];
    isLoading: boolean;
    onSuggestionSelect: (gameId: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, onSearch, suggestions, isLoading, onSuggestionSelect }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchBarRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        onSearch(searchTerm);
    };
    
    const handleSuggestionClick = (game: GameLookup) => {
        onSuggestionSelect(game.gameID);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setShowSuggestions(e.target.value.length > 0);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="relative w-full" ref={searchBarRef}>
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                </div>
            </form>
             {showSuggestions && searchTerm && (
                <SearchSuggestions
                    suggestions={suggestions}
                    isLoading={isLoading}
                    onSelect={handleSuggestionClick}
                />
            )}
        </div>
    );
};