
import React from 'react';

// FIX: Changed from React.FC to a standard function component to resolve SVG prop type issue with 'title'.
export const EpicGamesIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5V7.5h2v9h-2zm-4.5-9L10 12l-3.5 4.5V7.5zm9 0L13 12l3.5 4.5V7.5z"/>
    </svg>
);