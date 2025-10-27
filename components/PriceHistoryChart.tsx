
import React from 'react';

// Generates a random array of numbers to simulate price data for the chart
const generateChartData = (days: number, normalPrice: number, salePrice: number) => {
    const data = new Array(days).fill(0);
    const lowPoint = Math.min(normalPrice, salePrice) / normalPrice;

    for (let i = 0; i < days; i++) {
        // Mostly normal price
        let value = Math.random() < 0.8 ? 1.0 : (lowPoint + Math.random() * (1 - lowPoint));
        data[i] = value;
    }
    
    // Add some spikes for recent deals
    const dealSpikeCount = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < dealSpikeCount; i++) {
        const index = days - 1 - Math.floor(Math.random() * 15);
        if (index > 0) {
            data[index] = lowPoint;
        }
    }
    
    return data;
};

interface PriceHistoryChartProps {
    normalPrice: number;
    salePrice: number;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ normalPrice, salePrice }) => {
    const days = 90;
    const chartData = generateChartData(days, normalPrice, salePrice);
    const barWidth = 4;
    const barMargin = 2;
    const chartHeight = 50;
    const chartWidth = days * (barWidth + barMargin);

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg">
            <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                <g>
                    {chartData.map((value, index) => {
                        const barHeight = Math.max(5, value * chartHeight);
                        const x = index * (barWidth + barMargin);
                        const y = chartHeight - barHeight;
                        const isDealPrice = value < 1.0;

                        return (
                            <rect
                                key={index}
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill={isDealPrice ? '#4ade80' /* green-400 */ : '#475569' /* slate-600 */}
                                rx={2}
                            />
                        );
                    })}
                </g>
            </svg>
            <p className="text-xs text-center text-slate-400 mt-2">Price overview for last 90 days</p>
        </div>
    );
};
