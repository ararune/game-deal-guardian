
import React from 'react';

// FIX: Changed from React.FC to a standard function component to resolve SVG prop type issue with 'title'.
export const PlayStationIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM96,88a16,16,0,1,1,16,16A16,16,0,0,1,96,88Zm50.17,37.17,36,20.78a8,8,0,1,1-8,13.86L128,139.14l-29.32-8.06-21.51,37.26a8,8,0,0,1-13.86-8l28-48.5a8,8,0,0,1,13.32-4Z"/>
    </svg>
);