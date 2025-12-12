
import type { Database } from '../types/database.types';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface Props {
    candidate: Database['public']['Tables']['candidates']['Row'];
    onBuy: (type: 'VENCE' | 'PERDE', candidateId: string) => void;
}

export function CandidateCard({ candidate, onBuy }: Props) {
    return (
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-4">
                <img
                    src={candidate.image_url}
                    alt={candidate.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                />
                <div>
                    <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
                    <span className="text-sm text-gray-400 uppercase tracking-wider">{candidate.role}</span>
                </div>
                <div className="ml-auto flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    <TrendingUp className="w-3 h-3" />
                    {candidate.supply_vence_sold.toLocaleString()} Holders
                </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                    onClick={() => onBuy('VENCE', candidate.id)}
                    className="cursor-pointer group relative overflow-hidden rounded-xl bg-vence/10 hover:bg-vence/20 border border-vence/20 hover:border-vence/50 transition-all p-4 text-left"
                >
                    <div className="text-xs text-vence font-medium mb-1 uppercase tracking-wider">Apoiar</div>
                    <div className="text-2xl font-bold flex items-center gap-2 text-white">
                        R$ {candidate.price_vence.toFixed(2)}
                        <ArrowUpRight className="w-5 h-5 text-vence opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                </button>

                <button
                    onClick={() => onBuy('PERDE', candidate.id)}
                    className="cursor-pointer group relative overflow-hidden rounded-xl bg-perde/10 hover:bg-perde/20 border border-perde/20 hover:border-perde/50 transition-all p-4 text-left"
                >
                    <div className="text-xs text-perde font-medium mb-1 uppercase tracking-wider">Rejeitar</div>
                    <div className="text-2xl font-bold flex items-center gap-2 text-white">
                        R$ {candidate.price_perde.toFixed(2)}
                        <ArrowDownRight className="w-5 h-5 text-perde opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                </button>
            </div>
        </div>
    )
}
