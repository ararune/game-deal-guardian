
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GameListItem } from '../components/GameListItem';
import { FiltersSidebar, ActiveFilters } from '../components/FiltersSidebar';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { getDealsList, getStoresInfo } from '../services/cheapSharkService';
import { Deal, StoreInfo } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { Dropdown } from '../components/Dropdown';
import { GameListItemExpanded } from '../components/GameListItemExpanded';

const SORT_OPTIONS = [
    { id: 'Deal Rating', name: 'Hottest games' },
    { id: 'Metacritic', name: 'Metascore' },
    { id: 'Price', name: 'Price' },
    { id: 'Savings', name: 'Savings' },
    { id: 'Title', name: 'Title' },
    { id: 'Release', name: 'Release' },
];

const DEFAULT_SORT_BY = 'Deal Rating';
const DEFAULT_CURRENCY = 'USD';

const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$' };

const DealsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [deals, setDeals] = useState<Deal[]>([]);
    const [stores, setStores] = useState<StoreInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLaodingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [expandedDealId, setExpandedDealId] = useState<string | null>(null);
    const [currency] = useState(DEFAULT_CURRENCY);

    const activeFilters: ActiveFilters = {
        sortBy: searchParams.get('sortBy') || DEFAULT_SORT_BY,
        storeIDs: searchParams.get('storeIDs')?.split(',').filter(Boolean) || [],
        upperPrice: searchParams.get('upperPrice') || '',
        savings: searchParams.get('savings') || '',
        title: searchParams.get('title') || '',
    };
    
    const debouncedTitle = useDebounce(activeFilters.title, 400);

    const handleFilterChange = (filterType: keyof ActiveFilters, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', '0'); // Reset page on filter change

        switch (filterType) {
            case 'storeIDs':
                const currentStores = activeFilters.storeIDs;
                const newStores = currentStores.includes(value)
                    ? currentStores.filter(id => id !== value)
                    : [...currentStores, value];
                if (newStores.length > 0) newParams.set('storeIDs', newStores.join(','));
                else newParams.delete('storeIDs');
                break;
            
            case 'upperPrice':
            case 'savings':
                if (activeFilters[filterType] === value) newParams.delete(filterType);
                else newParams.set(filterType, value);
                break;

            case 'sortBy':
                newParams.set(filterType, value);
                break;
        }
        setSearchParams(newParams);
    };

    const handleTitleChange = (value: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', '0');
        if (value) newParams.set('title', value);
        else newParams.delete('title');
        setSearchParams(newParams);
    };

    const handleResetFilters = () => {
        setSearchParams({});
    };

    const fetchDeals = useCallback(async (isLoadMore = false) => {
        const currentPage = isLoadMore ? page + 1 : 0;
        if (isLoadMore) setIsLoadingMore(true);
        else setIsLoading(true);
        
        setError(null);
        if(!isLoadMore) setExpandedDealId(null);

        try {
            const fetchedDeals = await getDealsList({
                sortBy: activeFilters.sortBy,
                desc: activeFilters.sortBy !== 'Price',
                pageNumber: currentPage,
                currency,
                title: debouncedTitle,
                storeIDs: activeFilters.storeIDs.join(','),
                upperPrice: activeFilters.upperPrice,
                savings: activeFilters.savings,
            });

            const uniqueDeals = Array.from(new Map(fetchedDeals.map(deal => [deal.gameID, deal])).values());

            if (isLoadMore) {
                setDeals(prev => {
                    const existingGameIDs = new Set(prev.map(r => r.gameID));
                    const uniqueNewDeals = uniqueDeals.filter(deal => !existingGameIDs.has(deal.gameID));
                    return [...prev, ...uniqueNewDeals];
                });
            } else {
                setDeals(uniqueDeals);
            }
            setPage(currentPage);
        } catch (err) {
            setError('Failed to fetch game deals. Please try again later.');
            console.error(err);
        } finally {
            if (isLoadMore) setIsLoadingMore(false);
            else setIsLoading(false);
        }
    }, [searchParams.toString(), debouncedTitle, currency, page]);

    useEffect(() => {
        fetchDeals(false);
    }, [searchParams.toString(), debouncedTitle, currency]);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const storesData = await getStoresInfo();
                setStores(storesData);
            } catch (err) {
                 setError('Failed to fetch store information.');
                 console.error(err);
            }
        };
        fetchStores();
    }, []);

    const handleToggleExpand = (dealId: string) => {
        setExpandedDealId(prevId => (prevId === dealId ? null : dealId));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <FiltersSidebar 
                stores={stores}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onTitleChange={handleTitleChange}
                currencySymbol={CURRENCY_SYMBOLS[currency] || '$'}
                onReset={handleResetFilters}
            />
            <div>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-white">Current Deals</h2>
                            <span className="text-2xl font-bold text-slate-500">All Games</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-400">SORT BY:</span>
                        <Dropdown 
                            options={SORT_OPTIONS}
                            selectedId={activeFilters.sortBy}
                            onSelect={(id) => handleFilterChange('sortBy', id)}
                        />
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <SpinnerIcon className="w-12 h-12 text-slate-400" />
                    </div>
                ) : error ? (
                    <p className="text-center text-red-400 mt-8">{error}</p>
                ) : deals.length === 0 ? (
                    <p className="text-center text-gray-400 mt-8">
                        {activeFilters.title ? `No games found for "${activeFilters.title}".` : "No deals found for the selected filters."}
                    </p>
                ) : (
                    <div className="flex flex-col">
                        <div className="bg-slate-800/50 rounded-lg border border-slate-700">
                            {deals.map((item) => (
                                <React.Fragment key={`${item.gameID}-${item.dealID}`}>
                                <GameListItem 
                                    deal={item} 
                                    currencySymbol={CURRENCY_SYMBOLS[currency] || '$'}
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
                                        currencySymbol={CURRENCY_SYMBOLS[currency] || '$'}
                                    />
                                )}
                                </React.Fragment>
                            ))}
                        </div>
                        {!debouncedTitle && (
                            <div className="flex justify-center mt-6">
                                <button 
                                    onClick={() => fetchDeals(true)}
                                    disabled={isLaodingMore}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 w-full flex items-center justify-center min-h-[48px]"
                                >
                                    {isLaodingMore ? <SpinnerIcon className="w-6 h-6" /> : 'Load More Deals'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DealsPage;
