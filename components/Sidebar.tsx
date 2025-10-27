import React from 'react';
import { SidebarWidget } from './SidebarWidget';
import { RefreshIcon } from './icons/RefreshIcon';
import { BundleIcon } from './icons/BundleIcon';
import { GiftIcon } from './icons/GiftIcon';
import { SubscriptionIcon } from './icons/SubscriptionIcon';

const mockSubscriptions = [
    { title: 'Pillars of Eternity 2: Deadfire', platform: 'Game Pass', date: '24 Oct 2025, 15:36', thumb: 'https://cdn.akamai.steamstatic.com/steam/apps/560130/header.jpg' },
    { title: 'Pacific Drive', platform: 'Game Pass', date: '23 Oct 2025, 22:06', thumb: 'https://cdn.akamai.steamstatic.com/steam/apps/1478140/header.jpg' },
    { title: 'Fallout 3: Game of the Year', platform: 'Prime Gaming', date: '23 Oct 2025, 17:46', thumb: 'https://cdn.akamai.steamstatic.com/steam/apps/22370/header.jpg' },
    { title: 'Hellslave', platform: 'Prime Gaming', date: '23 Oct 2025, 14:45', thumb: 'https://cdn.akamai.steamstatic.com/steam/apps/1608450/header.jpg' },
];

const mockBundles = [
    { title: 'Kingdom: 10th Anniversary Bundle', store: 'Humble Store' },
    { title: 'Build your own Frightmare Bundle (2025)', store: 'Fanatical' },
    { title: 'Super Rare Vibes: Volume 1', store: 'GreenManGaming' },
];

const mockGiveaways = [
    { title: '911 Operator', thumb: 'https://cdn.akamai.steamstatic.com/steam/apps/503560/header.jpg' },
    { title: 'Mysterious House', thumb: 'https://cdn.akamai.steamstatic.com/steam/apps/1942530/header.jpg' },
    { title: 'Fear the Spotlight', thumb: 'https://cdn.akamai.steamstatic.com/steam/apps/1858590/header.jpg' },
];


export const Sidebar: React.FC = () => {
    return (
        <aside className="space-y-8">
            <SidebarWidget title="New in Subscriptions" icon={<SubscriptionIcon className="w-5 h-5"/>} actionIcon={<RefreshIcon className="w-5 h-5" />}>
                 <div className="space-y-3">
                    {mockSubscriptions.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <img src={item.thumb} alt={item.title} className="w-16 aspect-video object-cover rounded flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-white leading-tight">{item.title}</p>
                                <p className="text-xs text-slate-400">{item.platform} &middot; {item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </SidebarWidget>

            <SidebarWidget title="Latest Bundles" icon={<BundleIcon className="w-5 h-5"/>} >
                <div className="space-y-3">
                    {mockBundles.map((item, index) => (
                        <div key={index}>
                            <p className="text-sm text-slate-400">{item.store} <span className="text-blue-400">♡</span></p>
                            <p className="text-sm font-semibold text-white">{item.title}</p>
                        </div>
                    ))}
                </div>
            </SidebarWidget>

            <SidebarWidget title="Giveaways" icon={<GiftIcon className="w-5 h-5"/>}>
                <div className="grid grid-cols-2 gap-3">
                    {mockGiveaways.map((item, index) => (
                        <div key={index} className="relative group aspect-video rounded overflow-hidden cursor-pointer">
                            <img src={item.thumb} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110"/>
                             <div className="absolute inset-0 bg-black/40"></div>
                            <p className="absolute bottom-1 left-1 right-1 text-xs text-white font-semibold text-center leading-tight p-1">{item.title}</p>
                        </div>
                    ))}
                </div>
            </SidebarWidget>
        </aside>
    );
};
