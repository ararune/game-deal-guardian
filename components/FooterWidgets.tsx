import React from 'react';
import { TagIcon } from './icons/TagIcon';
import { ClockIcon } from './icons/ClockIcon';
import { GamepadIcon } from './icons/GamepadIcon';

const mockWaitlisted = [
    { title: 'Megabonk', price: '£8.51', store: 'Steam' },
    { title: 'Keeper', price: '£26.17', store: 'Steam' },
    { title: 'Bulwark Evolution', price: '£15.31', store: 'Fanatical' },
    { title: 'BALL X PIT', price: '£11.12', store: 'Fanatical' },
    { title: 'Dispatch', price: '£22.76', store: 'Steam' },
];

const mockCollected = [
    { title: 'Little Nightmares Enhanced', price: '£8.51', store: 'Steam' },
    { title: 'Tell Me Why: Chapter 1', price: '£26.17', store: 'Steam' },
    { title: 'Rise of the Tomb Raider', price: '£7.41', store: 'GreenManGaming' },
    { title: 'Welcome to Basingstoke', price: '£8.72', store: 'Steam' },
    { title: 'ZOMBORG', price: '£3.19', store: 'Fanatical' },
];

const FooterList: React.FC<{title: string, items: {title: string, price: string, store: string}[]}> = ({title, items}) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <h3 className="font-bold text-white uppercase tracking-wide mb-4 pb-2 border-b-2 border-slate-700">{title}</h3>
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-white truncate pr-4">{item.title}</span>
                    <div className="text-right flex-shrink-0">
                        <span className="font-semibold text-white">{item.price}</span>
                        <span className="text-slate-400 ml-2">{item.store}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const InfoCard: React.FC<{icon: React.ReactNode, title: string, children: React.ReactNode}> = ({icon, title, children}) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex items-center gap-6">
        <div className="text-blue-400">{icon}</div>
        <div>
            <h4 className="text-xl font-bold text-white">{title}</h4>
            <p className="text-slate-400 mt-1">{children}</p>
        </div>
    </div>
);


export const FooterWidgets: React.FC = () => {
    return (
        <div className="mt-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FooterList title="Most Waitlisted in last 30 days" items={mockWaitlisted} />
                <FooterList title="Most Collected in last 30 days" items={mockCollected} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InfoCard icon={<TagIcon className="w-16 h-16"/>} title="Explore">
                    Browse all the latest deals using an extensive set of filters and sorting options to find just what you want.
                </InfoCard>
                 <InfoCard icon={<ClockIcon className="w-16 h-16"/>} title="Wait">
                    Get notified right away when the games you want are the right price for you.
                </InfoCard>
                 <InfoCard icon={<GamepadIcon className="w-16 h-16"/>} title="Collect">
                    Track your entire collection. Know where, when, and how you got it.
                </InfoCard>
            </div>
        </div>
    );
};
