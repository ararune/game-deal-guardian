
import React from 'react';
import { FilterSection } from './FilterSection';
import { SearchIcon } from './icons/SearchIcon';
import { StoreIcon } from './icons/StoreIcon';
import { PriceTagIcon } from './icons/PriceTagIcon';
import { CutIcon } from './icons/CutIcon';
import { StoreInfo } from '../types';
import { ResetIcon } from './icons/ResetIcon';

export type ActiveFilters = {
    storeIDs: string[];
    upperPrice: string;
    sortBy: string;
    savings: string;
    title: string;
};

interface FiltersSidebarProps {
    stores: StoreInfo[];
    activeFilters: ActiveFilters;
    onFilterChange: (filterType: keyof ActiveFilters, value: string) => void;
    onTitleChange: (value: string) => void;
    currencySymbol: string;
    onReset: () => void;
}

const priceCutFilters = [
    { label: 'At least 25% off', value: '25' },
    { label: 'At least 50% off', value: '50' },
    { label: 'At least 75% off', value: '75' },
    { label: 'At least 90% off', value: '90' },
];

const mainStores = [
    { name: 'Steam', storeID: '1' },
    { name: 'GOG', storeID: '7' },
    { name: 'Epic Games Store', storeID: '25' },
];

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({ stores, activeFilters, onFilterChange, onTitleChange, currencySymbol, onReset }) => {
    
    const priceFilters = [
        { label: `Below ${currencySymbol}1`, value: '1' },
        { label: `Below ${currencySymbol}5`, value: '5' },
        { label: `Below ${currencySymbol}10`, value: '10' },
        { label: `Below ${currencySymbol}30`, value: '30' }
    ];

    return (
        <aside className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4 self-start">
            <div className="flex items-center gap-2">
                <button 
                    onClick={onReset}
                    className="flex-grow bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                    title="Reset all filters"
                >
                    <ResetIcon className="w-5 h-5" />
                    <span>Reset Filters</span>
                </button>
            </div>
             <div className="relative">
                <input
                    type="text"
                    placeholder="Search in deals"
                    value={activeFilters.title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                </div>
            </div>

            <FilterSection title="Shop" icon={<StoreIcon className="w-5 h-5"/>}>
                <ul className="space-y-1.5">
                    {mainStores.map(store => (
                        <li key={store.storeID} className="flex items-center justify-between text-sm">
                             <label className="flex items-center cursor-pointer" title={`Filter by ${store.name}`}>
                                <input 
                                    type="checkbox" 
                                    className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-blue-500 focus:ring-blue-500"
                                    checked={activeFilters.storeIDs.includes(store.storeID)}
                                    onChange={() => onFilterChange('storeIDs', store.storeID)}
                                />
                                <span className="ml-2 text-slate-300">{store.name}</span>
                             </label>
                        </li>
                    ))}
                </ul>
            </FilterSection>

            <FilterSection title="Price" icon={<PriceTagIcon className="w-5 h-5"/>}>
                <ul className="space-y-1.5">
                    {priceFilters.map(f => (
                         <li key={f.value}>
                            <button 
                                onClick={() => onFilterChange('upperPrice', f.value)}
                                className={`text-sm transition-colors duration-150 ${activeFilters.upperPrice === f.value ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
                                title={`Filter deals ${f.label.toLowerCase()}`}
                            >
                                {f.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </FilterSection>
            
            <FilterSection title="Price Cut" icon={<CutIcon className="w-5 h-5"/>}>
                <ul className="space-y-1.5">
                    {priceCutFilters.map(f => (
                        <li key={f.value}>
                            <button 
                                onClick={() => onFilterChange('savings', f.value)}
                                className={`text-sm transition-colors duration-150 ${activeFilters.savings === f.value ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
                                title={`Filter deals with ${f.label.toLowerCase()}`}
                            >
                                {f.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </FilterSection>
        </aside>
    );
};