import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Database } from '../types/database.types';
import type { PricePoint } from '../hooks/useMarketSimulation';

interface Props {
    candidate: Database['public']['Tables']['candidates']['Row'];
    history: PricePoint[];
}

export function BondingCurveChart({ candidate, history }: Props) {
    // Use history if available, otherwise fallback (or show empty)
    // We need to map history to the format Recharts expects, which matches our PricePoint interface mostly.
    const data = history.length > 0 ? history.map((h, i) => ({
        ...h,
        step: i
    })) : [];

    return (
        <div className="h-64 w-full bg-white rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="step" hide />
                    <YAxis
                        domain={['auto', 'auto']}
                        stroke="#9ca3af"
                        tickFormatter={(val: number) => `R$${val.toFixed(0)}`}
                        width={40}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                        labelStyle={{ display: 'none' }}
                        formatter={(value: number, name: string) => [`R$ ${value.toFixed(2)}`, name.toUpperCase()]}
                    />
                    <Line
                        type="monotone"
                        dataKey="vence"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={false}
                        name="VENCE"
                    />
                    <Line
                        type="monotone"
                        dataKey="perde"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={false}
                        name="PERDE"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
