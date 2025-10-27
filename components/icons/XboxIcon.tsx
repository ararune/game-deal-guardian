

import React from 'react';

// FIX: Changed from React.FC to a standard function component to resolve SVG prop type issue with 'title'.
export const XboxIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.96 2C6.44 2 2 6.44 2 11.96c0 5.15 3.86 9.42 8.8 9.92v-2.81c-3.23-.4-5.69-3.12-5.69-6.47 0-3.64 2.96-6.6 6.6-6.6 1.83 0 3.5.74 4.68 1.95L20.4 4.02C18.1 2.5 15.17 2 11.96 2zm.08 8.16c-2.3 0-4.17 1.87-4.17 4.17s1.87 4.17 4.17 4.17 4.17-1.87 4.17-4.17-1.87-4.17-4.17-4.17zm9.92-2.1c-1.03-2.3-2.86-4.14-5.17-5.17l-1.95 4.68c1.3.54 2.33 1.58 2.87 2.87l4.25-2.38z"/>
    </svg>
);