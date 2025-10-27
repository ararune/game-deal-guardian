
import React from 'react';

export const WindowsIcon = (props: React.SVGProps<SVGSVGElement> & { title?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <title>Windows</title>
        <path d="M3,12V6.75L9,5.43V11.91L3,12M21,12V4.5L9,2V11.91L21,12M3,13V18.25L9,19.57V13.09L3,13M21,13V20.5L9,22V13.09L21,13Z" />
    </svg>
);
