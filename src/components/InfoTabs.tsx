import { useState } from 'react';
import { Info, AlertTriangle, FileText } from 'lucide-react';

export function InfoTabs() {
    const [activeTab, setActiveTab] = useState<'REGRAS' | 'DISCLAIMER' | 'TERMOS'>('REGRAS');

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all">
            {/* Header / Tabs */}
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2 overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => setActiveTab('REGRAS')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'REGRAS' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <Info size={14} /> REGRAS
                </button>
                <button
                    onClick={() => setActiveTab('DISCLAIMER')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'DISCLAIMER' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <AlertTriangle size={14} /> DISCLAIMER
                </button>
                <button
                    onClick={() => setActiveTab('TERMOS')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'TERMOS' ? 'bg-blue-50 text-blue-700' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <FileText size={14} /> TERMOS
                </button>
            </div>

            {/* Content */}
            <div className="text-sm text-gray-600 leading-relaxed min-h-[60px] animate-in fade-in duration-300">
                {activeTab === 'REGRAS' && (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                            <span>Mecânica</span>
                            <span>Oct 4, 2026</span>
                        </div>
                        <p>O mercado fecha no dia da eleição. Ganhos são distribuídos proporcionalmente aos tokes VENCE do vencedor. O preço varia conforme a demanda (Bonding Curve).</p>
                    </div>
                )}

                {activeTab === 'DISCLAIMER' && (
                    <div className="space-y-2">
                        <p className="text-yellow-800 font-medium">Esta é uma plataforma de simulação.</p>
                        <p>Os "investimentos" aqui realizados utilizam tokens fictícios ou para fins de entretenimento, sem garantia de retorno financeiro real.</p>
                    </div>
                )}

                {activeTab === 'TERMOS' && (
                    <div className="space-y-2">
                        <p>Ao utilizar esta plataforma, você concorda com nossos termos de serviço. O uso de automação ou bots é proibido.</p>
                        <a href="#" className="text-xs text-blue-600 font-bold hover:underline">Ler termos completos →</a>
                    </div>
                )}
            </div>
        </div>
    );
}
