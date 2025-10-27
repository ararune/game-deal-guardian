
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameListItem } from '../components/GameListItem';
import { GameDetailsView } from '../components/GameDetailsView';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { getDealsList, getStoresInfo } from '../services/cheapSharkService';
import { Deal, StoreInfo } from '../types';
import { FeaturedDeals } from '../components/FeaturedDeals';
import { Sidebar } from '../components/Sidebar';
import { GameListItemExpanded } from '../components/GameListItemExpanded';

const DEFAULT_CURRENCY = 'USD';
const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$' };

const HomePage: React.FC = () => {
    const [expandedDealId, setExpandedDealId] = useState<string | null>(null);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [stores, setStores] = useState<StoreInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currency] = useState(DEFAULT_CURRENCY);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [dealsData, storesData] = await Promise.all([
                    getDealsList({ sortBy: 'Deal Rating', pageSize: 12 }),
                    getStoresInfo()
                ]);
                
                const uniqueDeals = Array.from(new Map(dealsData.map(deal => [deal.gameID, deal])).values());
                setDeals(uniqueDeals);
                setStores(storesData);
            } catch (err) {
                setError('Failed to fetch initial data. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleToggleExpand = (dealId: string) => {
        setExpandedDealId(prevId => (prevId === dealId ? null : dealId));
    };

    const currencySymbol = CURRENCY_SYMBOLS[currency] || '$';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            <div className="space-y-8">
                <h1 className="text-3xl font-bold text-white">Popular Games</h1>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64"><SpinnerIcon className="w-12 h-12 text-slate-400" /></div>
                ) : error ? (
                    <p className="text-center text-red-400 mt-8">{error}</p>
                ) : deals.length > 0 ? (
                    <>
                        <FeaturedDeals deals={deals.slice(0, 2)} currencySymbol={currencySymbol} />
                        
                        <h2 className="text-2xl font-bold text-white">Latest Deals</h2>
                        <div className="bg-slate-800/50 rounded-lg border border-slate-700">
                            {deals.slice(2).map((item) => (
                                <React.Fragment key={`${item.gameID}-${item.dealID}`}>
                                    <GameListItem 
                                        deal={item} 
                                        currencySymbol={currencySymbol}
                                        store={stores.find(s => s.storeID === item.storeID)}
                                        isExpanded={expandedDealId === item.dealID}
                                        onToggleExpand={handleToggleExpand}
                                    />
                                    {expandedDealId === item.dealID && (
                                        <GameListItemExpanded 
                                            gameId={item.gameID}
                                            deal={item}
                                            stores={stores}
                                            currency={currency}
                                            currencySymbol={currencySymbol}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="flex justify-center mt-6">
                            <button 
                                onClick={() => navigate('/deals')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
                            >
                                Browse All Deals
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-400 mt-8">No deals found at the moment.</p>
                )}
            </div>
            <Sidebar />
        </div>
    );
};

export default HomePage;
