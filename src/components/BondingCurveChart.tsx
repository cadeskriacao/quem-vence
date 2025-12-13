import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartLine {
    dataKey: string;
    stroke: string;
    name: string;
}

interface Props {
    data: any[];
    lines: ChartLine[];
    currencyFormatter?: (value: number) => string;
}

export function BondingCurveChart({ data, lines, currencyFormatter }: Props) {
    const defaultFormatter = (val: number) => `R$${val.toFixed(2)}`;
    const formatter = currencyFormatter || defaultFormatter;

    return (
        <div className="h-64 w-full bg-white rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="step" hide />
                    <YAxis
                        domain={[0, 100]}
                        stroke="#9ca3af"
                        tickFormatter={(val) => formatter(val).replace('%', '') + '%'}
                        width={40}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                        labelStyle={{ display: 'none' }}
                        formatter={(value: number, name: string) => [formatter(value), name.toUpperCase()]}
                    />
                    {lines.map((line) => (
                        <Line
                            key={line.dataKey}
                            type="monotone"
                            dataKey={line.dataKey}
                            stroke={line.stroke}
                            strokeWidth={3}
                            dot={false}
                            name={line.name}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
