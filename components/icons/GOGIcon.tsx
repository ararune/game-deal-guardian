
import React from 'react';

// FIX: Changed from React.FC to a standard function component to resolve SVG prop type issue with 'title'.
export const GOGIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9.5c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-1c-.83 0-1.5-.67-1.5-1.5v-4zm-4.5 0c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-1c-.83 0-1.5-.67-1.5-1.5v-4z"/>
    </svg>
);