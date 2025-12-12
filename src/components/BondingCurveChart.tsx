
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BASE_PRICE, PRICE_INCREMENT } from '../lib/bondingCurve';
import type { Database } from '../types/database.types';

interface Props {
    candidate: Database['public']['Tables']['candidates']['Row'];
}

export function BondingCurveChart({ candidate }: Props) {
    const data = [];
    const V = candidate.supply_vence_sold;
    const P = candidate.supply_perde_sold;
    // If no sales, show at least 0 to 10 'steps' of flat line
    const steps = 20;

    for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        // Interpolate history up to current state
        // Note: This assumes linear growth for both sides, which is a simplification
        const v_curr = V * progress;
        const p_curr = P * progress;

        // Calculate price at this historical point
        // Price Vence = P0 + (V_sold - P_sold) * 0.01
        // Price Perde = P0 - (V_sold - P_sold) * 0.01
        const net = v_curr - p_curr;

        data.push({
            step: i,
            vence: BASE_PRICE + (net * PRICE_INCREMENT),
            perde: BASE_PRICE - (net * PRICE_INCREMENT),
        });
    }

    return (
        <div className="h-64 w-full bg-white/5 rounded-xl p-4 border border-white/5">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="step" hide />
                    <YAxis
                        domain={['auto', 'auto']}
                        stroke="#666"
                        tickFormatter={(val: number) => `R$${val.toFixed(0)}`}
                        width={40}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                        labelStyle={{ display: 'none' }}
                        formatter={(value: number, name: string) => [`R$ ${value.toFixed(2)}`, name.toUpperCase()]}
                    />
                    <Line
                        type="monotone"
                        dataKey="vence"
                        stroke="#00ff9d"
                        strokeWidth={3}
                        dot={false}
                        name="VENCE"
                    />
                    <Line
                        type="monotone"
                        dataKey="perde"
                        stroke="#ff0055"
                        strokeWidth={3}
                        dot={false}
                        name="PERDE"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
