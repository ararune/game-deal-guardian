
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface DropdownOption {
    id: string;
    name: string;
    icon?: React.ReactNode;
}

interface DropdownProps {
    options: DropdownOption[];
    selectedId: string;
    onSelect: (id: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ options, selectedId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find(opt => opt.id === selectedId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (id: string) => {
        onSelect(id);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-md text-sm font-semibold text-white hover:bg-slate-700/90 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
            >
                <span>{selectedOption?.name || 'Select...'}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 min-w-[200px] bg-slate-800/90 backdrop-blur-lg border border-slate-700 rounded-lg shadow-lg z-10 py-1">
                    {options.map(option => (
                        <button
                            key={option.id}
                            onClick={() => handleSelect(option.id)}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${selectedId === option.id ? 'bg-slate-600/50 text-white' : 'text-gray-300 hover:bg-slate-700/70'}`}
                        >
                            {option.icon}
                            {option.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
