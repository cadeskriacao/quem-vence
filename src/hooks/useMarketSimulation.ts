import { useState, useEffect, useCallback } from 'react';
import type { Database } from '../types/database.types';
import { MOCK_CANDIDATES } from '../data/mock';
import { BASE_PRICE, PRICE_INCREMENT } from '../lib/bondingCurve';

export type Candidate = Database['public']['Tables']['candidates']['Row'];

export interface PricePoint {
    time: number;
    vence: number;
    perde: number;
}

export interface MarketState {
    candidates: Candidate[];
    // Map candidate ID to their price history
    history: Record<string, PricePoint[]>;
}

export function useMarketSimulation() {
    const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
    const [history, setHistory] = useState<Record<string, PricePoint[]>>(() => {
        const initialHist: Record<string, PricePoint[]> = {};
        MOCK_CANDIDATES.forEach(c => {
            // Seed with some initial flat history
            initialHist[c.id] = Array.from({ length: 20 }, (_, i) => ({
                time: Date.now() - (20 - i) * 1000,
                vence: c.price_vence,
                perde: c.price_perde
            }));
        });
        return initialHist;
    });

    // Function to execute a trade (also exposed to UI)
    const executeTrade = useCallback((candidateId: string, type: 'VENCE' | 'PERDE', qty: number) => {
        setCandidates(prev => prev.map(c => {
            if (c.id !== candidateId) return c;

            // Update Supply
            const newVenceSold = type === 'VENCE' ? c.supply_vence_sold + qty : c.supply_vence_sold;
            const newPerdeSold = type === 'PERDE' ? c.supply_perde_sold + qty : c.supply_perde_sold;

            // Enforce Supply Limit (MOCK - in real DB this would be a check constraint)
            if (type === 'VENCE' && newVenceSold > 10000) return c; // Reject trade
            if (type === 'PERDE' && newPerdeSold > 10000) return c; // Reject trade

            // Net Delta for VENCE Price: Vence - Perde
            const netVence = newVenceSold - newPerdeSold;
            // Net Delta for PERDE Price: Perde - Vence (Inverse)
            const netPerde = newPerdeSold - newVenceSold;

            // Calculate new unit prices
            const newPriceVence = BASE_PRICE + (netVence * PRICE_INCREMENT);
            const newPricePerde = BASE_PRICE + (netPerde * PRICE_INCREMENT);

            // Clamp prices (min 0.01)
            const clampedVence = Math.max(0.01, newPriceVence);
            const clampedPerde = Math.max(0.01, newPricePerde);

            return {
                ...c,
                supply_vence_sold: newVenceSold,
                supply_perde_sold: newPerdeSold,
                price_vence: clampedVence,
                price_perde: clampedPerde
            };
        }));
    }, []);

    // Update history whenever candidates change
    useEffect(() => {
        const now = Date.now();
        setHistory(prev => {
            const next = { ...prev };
            candidates.forEach(c => {
                const points = next[c.id] || [];
                // Add new point
                points.push({
                    time: now,
                    vence: c.price_vence,
                    perde: c.price_perde
                });
                // Keep last 50 points
                if (points.length > 50) points.shift();
                next[c.id] = points;
            });
            return next;
        });
    }, [candidates]);

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            // 50% chance to do nothing this tick (reduce noise)
            if (Math.random() > 0.5) return;

            // Pick random candidate
            const candidate = candidates[Math.floor(Math.random() * candidates.length)];

            // Determine action: Buy VENCE (trend momentum?) or Buy PERDE
            const isTrendUp = candidate.price_vence > candidate.price_perde;
            const type = Math.random() > (isTrendUp ? 0.3 : 0.7) ? 'VENCE' : 'PERDE'; // Bias towards trend

            // Random quantity 1-50
            const qty = Math.floor(Math.random() * 50) + 1;

            executeTrade(candidate.id, type, qty);

        }, 1500); // Check every 1.5s

        return () => clearInterval(interval);
    }, [candidates, executeTrade]);

    return { candidates, history, executeTrade };
}
