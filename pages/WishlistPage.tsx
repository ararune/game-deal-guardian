
import React, { useState, useEffect } from 'react';
import { WishlistView } from '../components/WishlistView';
import { getStoresInfo } from '../services/cheapSharkService';
import { StoreInfo } from '../types';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';

const DEFAULT_CURRENCY = 'USD';

const WishlistPage: React.FC = () => {
    const [stores, setStores] = useState<StoreInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStores = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const storesData = await getStoresInfo();
                setStores(storesData);
            } catch (err) {
                 setError('Failed to fetch store information.');
                 console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStores();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><SpinnerIcon className="w-12 h-12 text-slate-400" /></div>;
    }

    if (error) {
        return <p className="text-center text-red-400 mt-8">{error}</p>;
    }

    return (
        <WishlistView 
            stores={stores} 
            currency={DEFAULT_CURRENCY}
            storePlatformMap={{}}
        />
    );
};

export default WishlistPage;
