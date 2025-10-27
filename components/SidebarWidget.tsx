import React from 'react';

interface SidebarWidgetProps {
    title: string;
    icon: React.ReactNode;
    actionIcon?: React.ReactNode;
    children: React.ReactNode;
}

export const SidebarWidget: React.FC<SidebarWidgetProps> = ({ title, icon, actionIcon, children }) => {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-slate-700">
                <div className="flex items-center gap-2">
                    <span className="text-blue-400">{icon}</span>
                    <h3 className="font-bold text-white uppercase tracking-wide">{title}</h3>
                </div>
                {actionIcon && <button className="text-slate-400 hover:text-white transition-colors">{actionIcon}</button>}
            </div>
            {children}
        </div>
    );
};
