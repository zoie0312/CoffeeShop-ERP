import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface SalesChartProps {
    data: {
        date: string;
        sales: number;
        orders: number;
    }[];
}

export default function SalesChart({ data }: SalesChartProps) {
    const theme = useTheme();
    
    // Format data for Chart.js
    const chartData = {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: 'Sales ($)',
                data: data.map(item => item.sales),
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.main}20`,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4
            },
            {
                label: 'Orders',
                data: data.map(item => item.orders),
                borderColor: theme.palette.secondary.main,
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4,
                yAxisID: 'y1'
            }
        ]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                align: 'end' as const,
                labels: {
                    boxWidth: 10,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: theme.palette.background.paper,
                titleColor: theme.palette.text.primary,
                bodyColor: theme.palette.text.secondary,
                borderColor: theme.palette.divider,
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                position: 'left' as const,
                grid: {
                    color: theme.palette.divider
                },
                ticks: {
                    callback: (value: any) => `$${value}`
                }
            },
            y1: {
                position: 'right' as const,
                grid: {
                    display: false
                },
                ticks: {
                    callback: (value: any) => `${value}`
                }
            }
        }
    };
    
    return (
        <Box sx={{ height: 360 }}>
            <Line data={chartData} options={options} />
        </Box>
    );
} 