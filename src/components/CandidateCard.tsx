import { ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import type { Database } from '../types/database.types';

interface Props {
    candidate: Database['public']['Tables']['candidates']['Row'];
    onBuy: (type: 'VENCE' | 'PERDE', candidateId: string) => void;
}

export function CandidateCard({ candidate, onBuy }: Props) {
    // Rigorous Math: Probability derived strictly from Price relative to the Max Price ($20)
    // Logic: In a constant sum market (YES + NO = $20), Price = $20 * Prob.
    // Therefore, Prob = Price / 20.

    const probVence = (candidate.price_vence / 20) * 100;
    const probPerde = (candidate.price_perde / 20) * 100;

    // Odds / Multiplier = 1 / Probability
    // e.g. 50% = 2.0x. 25% = 4.0x.
    const multiVence = (100 / probVence).toFixed(2);
    const multiPerde = (100 / probPerde).toFixed(2);

    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img
                        src={candidate.image_url}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                    <span className="text-lg font-bold text-gray-900">{candidate.name}</span>
                </div>
                <ChevronDown className="text-gray-400 w-5 h-5" />
            </div>

            {/* Probability Bar */}
            <div className="flex justify-between text-sm font-bold text-gray-900 mb-1">
                <span>{probVence.toFixed(0)}%</span>
                <span className="text-gray-400 font-normal text-xs uppercase tracking-wide mt-0.5">Chance</span>
                <span>{probPerde.toFixed(0)}%</span>
            </div>

            <div className="h-2 w-full flex rounded-full overflow-hidden mb-6">
                <div className="bg-vence h-full transition-all duration-500" style={{ width: `${probVence}%` }} />
                <div className="bg-perde h-full transition-all duration-500" style={{ width: `${probPerde}%` }} />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                {/* Yes Button */}
                <button
                    onClick={() => onBuy('VENCE', candidate.id)}
                    className="group relative bg-vence hover:bg-vence-dark text-white rounded-xl p-3 transition-colors flex flex-col items-center justify-center gap-1 shadow-sm active:translate-y-0.5"
                >
                    <div className="w-full flex justify-between items-center px-2">
                        <div className="flex items-center gap-1 font-bold">
                            <CheckCircle size={16} /> Yes
                        </div>
                        <span className="bg-white/20 text-xs font-bold px-2 py-0.5 rounded-full">
                            {multiVence}x
                        </span>
                    </div>
                </button>

                {/* No Button */}
                <button
                    onClick={() => onBuy('PERDE', candidate.id)}
                    className="group relative bg-perde hover:bg-perde-dark text-white rounded-xl p-3 transition-colors flex flex-col items-center justify-center gap-1 shadow-sm active:translate-y-0.5"
                >
                    <div className="w-full flex justify-between items-center px-2">
                        <div className="flex items-center gap-1 font-bold">
                            <XCircle size={16} /> No
                        </div>
                        <span className="bg-white/20 text-xs font-bold px-2 py-0.5 rounded-full">
                            {multiPerde}x
                        </span>
                    </div>
                </button>
            </div>

            {/* Price Footer */}
            <div className="flex justify-between mt-3 text-xs font-medium px-1">
                <div className="text-gray-900">
                    R${candidate.price_vence.toFixed(2)} <span className="text-vence">→ R${(candidate.price_vence * 1.05).toFixed(2)}</span>
                </div>
                <div className="text-gray-900">
                    R${candidate.price_perde.toFixed(2)} <span className="text-vence">→ R${(candidate.price_perde * 1.05).toFixed(2)}</span>
                </div>
            </div>
        </div>
    )
}
