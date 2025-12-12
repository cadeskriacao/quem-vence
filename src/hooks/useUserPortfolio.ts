import { useState, useCallback } from 'react';


export interface PortfolioItem {
    candidateId: string;
    type: 'VENCE' | 'PERDE';
    quantity: number;
    totalCost: number; // For average price calculation
}

export function useUserPortfolio() {
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [balance, setBalance] = useState(0);

    const addToPortfolio = useCallback((candidateId: string, type: 'VENCE' | 'PERDE', quantity: number, totalCost: number) => {
        // Deduct from balance (assuming mock infinite balance for buys? User asked for deposit flow later maybe, but for now we focus on Sell->Balance->Withdraw)
        // For MVP, we allow buying "on credit" or initialized money, let's keep it simple: Buying doesn't check balance yet, but SELLING adds to it.

        setPortfolio(prev => {
            const existingIndex = prev.findIndex(p => p.candidateId === candidateId && p.type === type);

            if (existingIndex >= 0) {
                // Update existing position
                const newPortfolio = [...prev];
                const item = newPortfolio[existingIndex];
                newPortfolio[existingIndex] = {
                    ...item,
                    quantity: item.quantity + quantity,
                    totalCost: item.totalCost + totalCost
                };
                return newPortfolio;
            } else {
                // Add new position
                return [...prev, { candidateId, type, quantity, totalCost }];
            }
        });
    }, []);

    const sellFromPortfolio = useCallback((candidateId: string, type: 'VENCE' | 'PERDE', quantity: number, saleValue: number) => {
        setPortfolio(prev => {
            const index = prev.findIndex(p => p.candidateId === candidateId && p.type === type);
            if (index === -1) return prev;

            const item = prev[index];
            // Calculate proportionate cost basis removed
            const costToRemove = (quantity / item.quantity) * item.totalCost;

            if (item.quantity <= quantity) {
                // Sold all
                return prev.filter((_, i) => i !== index);
            } else {
                // Sold partial
                const newPortfolio = [...prev];
                newPortfolio[index] = {
                    ...item,
                    quantity: item.quantity - quantity,
                    totalCost: item.totalCost - costToRemove
                };
                return newPortfolio;
            }
        });

        setBalance(b => b + saleValue);
    }, []);

    const withdrawBalance = useCallback(() => {
        setBalance(0);
    }, []);

    return { portfolio, balance, addToPortfolio, sellFromPortfolio, withdrawBalance };
}
