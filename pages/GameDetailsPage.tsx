
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GameDetailsView } from '../components/GameDetailsView';
import { getStoresInfo } from '../services/cheapSharkService';
import { StoreInfo } from '../types';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';

const DEFAULT_CURRENCY = 'USD';
const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$' };

const GameDetailsPage: React.FC = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const [stores, setStores] = useState<StoreInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currency] = useState(DEFAULT_CURRENCY);

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
        return <div className="flex justify-center items-center h-96"><SpinnerIcon className="w-12 h-12 text-slate-400" /></div>;
    }

    if (error) {
        return <p className="text-center text-red-400 mt-8">{error}</p>;
    }

    if (!gameId) {
        return <p className="text-center text-red-400 mt-8">Game ID is missing.</p>;
    }

    return (
        <GameDetailsView
            gameId={gameId}
            stores={stores}
            currency={currency}
            currencySymbol={CURRENCY_SYMBOLS[currency] || '$'}
            storePlatformMap={{}} // This can be enhanced later
        />
    );
};

export default GameDetailsPage;
