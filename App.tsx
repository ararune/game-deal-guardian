

import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { searchGamesByTitle } from './services/cheapSharkService';
import { GameLookup } from './types';
import { WishlistProvider } from './context/WishlistContext';
import { useDebounce } from './hooks/useDebounce';
import HomePage from './pages/HomePage';
import DealsPage from './pages/DealsPage';
import WishlistPage from './pages/WishlistPage';
import GameDetailsPage from './pages/GameDetailsPage';

const AppLayout: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<GameLookup[]>([]);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const navigate = useNavigate();

    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearchTerm) {
                setIsSuggestionsLoading(true);
                const games = await searchGamesByTitle(debouncedSearchTerm, 10);
                setSuggestions(games);
                setIsSuggestionsLoading(false);
            } else {
                setSuggestions([]);
            }
        };
        performSearch();
    }, [debouncedSearchTerm]);

    const handleSearch = (query: string) => {
        setSearchTerm(query);
        setSuggestions([]); 
        if (query) {
            navigate(`/deals?title=${encodeURIComponent(query)}`);
        } else {
            navigate('/deals');
        }
    };
    
    const handleGameSelect = (gameId: string) => {
        setSearchTerm('');
        setSuggestions([]);
        navigate(`/game/${gameId}`);
    };

    return (
        <>
            <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
                suggestions={suggestions}
                onSuggestionSelect={handleGameSelect}
                isSuggestionsLoading={isSuggestionsLoading}
            />
            <main className="container mx-auto p-4 md:p-6">
                <Outlet />
            </main>
            <footer className="container mx-auto p-4 md:p-6 mt-8 border-t border-slate-700/50 text-slate-400 text-sm text-center">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </footer>
        </>
    );
};


const App = () => {
    return (
        <WishlistProvider>
            <div className="min-h-screen bg-slate-900 text-white font-['Inter',_sans-serif]">
                 <div className="fixed inset-0 h-full w-full bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] -z-10"></div>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/deals" element={<DealsPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/game/:gameId" element={<GameDetailsPage />} />
                    </Route>
                </Routes>
            </div>
        </WishlistProvider>
    );
};

export default App;