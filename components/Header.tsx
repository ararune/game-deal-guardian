import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { GameLookup } from '../types';
import { UserIcon } from './icons/UserIcon';
import { ShieldIcon } from './icons/ShieldIcon';

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onSearch: (term: string) => void;
    suggestions: GameLookup[];
    isSuggestionsLoading: boolean;
    onSuggestionSelect: (gameId: string) => void;
}

const NavItem: React.FC<{ children: React.ReactNode, to: string }> = ({ children, to }) => (
     <NavLink 
        to={to}
        className={({ isActive }) => `flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
    >
        {children}
    </NavLink>
)

export const Header: React.FC<HeaderProps> = (props) => {
    const { searchTerm, setSearchTerm, onSearch, suggestions, isSuggestionsLoading, onSuggestionSelect } = props;
    
    return (
        <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center h-16 gap-6">
                    {/* Left Section */}
                    <div className="flex items-center">
                         <Link to="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-lg flex-shrink-0">
                            <ShieldIcon className="w-8 h-8 text-blue-500" />
                            <h1 className="text-xl font-bold text-white tracking-wide hidden sm:block">
                                GameDeal<span className="text-slate-400">Guardian</span>
                            </h1>
                        </Link>
                    </div>

                    {/* Center Section */}
                    <div className="flex-1 flex justify-center min-w-0 px-4">
                        <div className="w-full max-w-md">
                             <SearchBar 
                                searchTerm={searchTerm} 
                                setSearchTerm={setSearchTerm} 
                                onSearch={onSearch} 
                                suggestions={suggestions}
                                isLoading={isSuggestionsLoading}
                                onSuggestionSelect={onSuggestionSelect}
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        <nav className="hidden md:flex items-center gap-1">
                            <NavItem to="/">Home</NavItem>
                            <NavItem to="/deals">Deals</NavItem>
                            <NavItem to="/wishlist">Wishlist</NavItem>
                        </nav>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors flex-shrink-0">
                            <UserIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};