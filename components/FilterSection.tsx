
import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface FilterSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const FilterSection: React.FC<FilterSectionProps> = ({ title, icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-t border-slate-700/80 pt-4">
            <button 
                className="w-full flex justify-between items-center text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <span className="text-slate-400">{icon}</span>
                    <h4 className="font-semibold text-slate-200">{title}</h4>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-3 ml-1 pl-6 border-l border-slate-700">
                    {children}
                </div>
            )}
        </div>
    );
};
