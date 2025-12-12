import { X, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import type { PortfolioItem } from '../hooks/useUserPortfolio';
import type { Candidate } from '../hooks/useMarketSimulation';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    portfolio: PortfolioItem[];
    candidates: Candidate[];
    balance: number;
    onSell: (candidateId: string, type: 'VENCE' | 'PERDE', quantity: number, saleValue: number) => void;
    onWithdraw: () => void;
}

export function WalletModal({ isOpen, onClose, portfolio, candidates, balance, onSell, onWithdraw }: Props) {
    if (!isOpen) return null;

    // Calculate totals
    const totalInvested = portfolio.reduce((acc, item) => acc + item.totalCost, 0);

    let totalCurrentValue = 0;

    const positions = portfolio.map(item => {
        const candidate = candidates.find(c => c.id === item.candidateId);
        if (!candidate) return null;

        const currentPrice = item.type === 'VENCE' ? candidate.price_vence : candidate.price_perde;
        const currentValue = item.quantity * currentPrice;
        totalCurrentValue += currentValue;

        const pnl = currentValue - item.totalCost;
        const pnlPercent = (pnl / item.totalCost) * 100;

        return {
            ...item,
            candidateName: candidate.name,
            currentPrice,
            currentValue,
            pnl,
            pnlPercent
        };
    }).filter(Boolean);

    const totalPnL = totalCurrentValue - totalInvested;
    const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-200 font-sans flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                        <Wallet size={20} className="text-gray-500" />
                        Minha Carteira
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Summary Card */}
                <div className="p-4">
                    <div className="bg-gray-900 rounded-xl p-5 text-white shadow-lg space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1">Patrimônio Total</div>
                                <div className="text-3xl font-black">R$ {(totalCurrentValue + balance).toFixed(2)}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1">Saldo Livre</div>
                                <div className="text-xl font-bold text-green-400">R$ {balance.toFixed(2)}</div>
                            </div>
                        </div>

                        {balance > 0 && (
                            <button
                                onClick={() => {
                                    if (confirm('Confirmar saque via PIX?')) {
                                        onWithdraw();
                                        alert('Saque solicitado com sucesso! O valor cairá na sua conta em instantes.');
                                    }
                                }}
                                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                Solicitar Saque (PIX)
                            </button>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                            <div>
                                <div className="text-gray-400 text-xs">Investido</div>
                                <div className="font-bold">R$ {totalInvested.toFixed(2)}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-xs">Retorno</div>
                                <div className={`font-bold flex items-center gap-1 ${totalPnL >= 0 ? 'text-vence' : 'text-perde'}`}>
                                    {totalPnL >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {totalPnLPercent.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Positions List */}
                <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2 mb-3">Minhas Posições</h3>

                    {positions.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm">
                            Você ainda não tem investimentos.
                        </div>
                    ) : (
                        positions.map((pos, idx) => pos && (
                            <div key={`${pos.candidateId}-${pos.type}-${idx}`} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm space-y-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-gray-900">{pos.candidateName}</div>
                                        <div className={`text-xs font-bold px-2 py-0.5 rounded-md w-fit mt-1 ${pos.type === 'VENCE' ? 'bg-vence/10 text-vence-dark' : 'bg-perde/10 text-perde-dark'}`}>
                                            {pos.type}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">R$ {pos.currentValue.toFixed(2)}</div>
                                        <div className={`text-xs font-bold ${pos.pnl >= 0 ? 'text-vence' : 'text-perde'}`}>
                                            {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)} ({pos.pnlPercent.toFixed(1)}%)
                                        </div>
                                    </div>
                                </div>

                                {/* Sell Button */}
                                <button
                                    onClick={() => {
                                        if (confirm(`Vender toda posição de ${pos.type} em ${pos.candidateName}?`)) {
                                            onSell(pos.candidateId, pos.type, pos.quantity, pos.currentValue);
                                        }
                                    }}
                                    className="w-full py-2 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 text-xs font-bold uppercase rounded-lg border border-gray-200 transition-colors"
                                >
                                    Vender Posição
                                </button>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
