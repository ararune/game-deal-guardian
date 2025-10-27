
export const formatDate = (timestamp: number): string => {
    if (!timestamp || timestamp === 0) {
        return 'N/A';
    }
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
