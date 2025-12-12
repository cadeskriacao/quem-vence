
import { useState, useEffect } from 'react';
import { X, CheckCircle, Copy, Loader2, AlertTriangle } from 'lucide-react';
import type { Database } from '../types/database.types';
import { calculatePurchase } from '../lib/bondingCurve';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    candidate: Database['public']['Tables']['candidates']['Row'];
    type: 'VENCE' | 'PERDE';
    onSuccess: (qty: number, cpf: string, whatsapp: string) => void;
}

type Step = 'QUANTITY' | 'USER_INFO' | 'PAYMENT' | 'SUCCESS';

export function PurchaseModal({ isOpen, onClose, candidate, type, onSuccess }: Props) {
    const [step, setStep] = useState<Step>('QUANTITY');
    const [quantity, setQuantity] = useState<string>('10'); // string to handle input better
    const [cpf, setCpf] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setStep('QUANTITY');
            setQuantity('10');
            setCpf('');
            setWhatsapp('');
            setAgreed(false);
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Calculation Logic
    const qtyNum = parseInt(quantity) || 0;
    // Calculate price based on type.
    // Note: calculatePurchase assumes standard bonding curve. 
    // For this model where P_VENCE and P_PERDE are coupled:
    // Buying VENCE = Price goes UP. Buying PERDE = Price goes UP (for that asset, because you consume supply from base).
    // Actually, wait. "Buy VENCE" -> Costs current Price.
    // Is the cost calculation using the INTEGRAL of the curve?
    // "Cenário de Teste: Compra em Lote... Preço #1 10.00, #100 10.99. Média 10.495". 
    // YES, it uses the integral (average price). 
    // My `calculatePurchase` function handles this.
    // But I need to pass the correct 'current sold amount' relative to the curve direction.
    // If buying VENCE: Use supply_vence_sold.
    // If buying PERDE: Use supply_perde_sold. 
    // (Assuming symmetric curves starting from P0=10).

    const currentSold = type === 'VENCE' ? candidate.supply_vence_sold : candidate.supply_perde_sold;
    const { total, averagePrice } = calculatePurchase(currentSold, qtyNum);

    const handlePayment = () => {
        setLoading(true);
        // Mock API call / PIX generation
        setTimeout(() => {
            setLoading(false);
            setStep('SUCCESS');
            // Auto close/refresh after success?
            // onSuccess passed to update parent state
            onSuccess(qtyNum, cpf, whatsapp);
        }, 3000); // 3s delay to simulate payment check
    };

    const copyPix = () => {
        navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540410.005802BR5913Quem Vence App6008Sao Paulo62070503***6304");
        alert("Código PIX copiado!");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-200 font-sans">

                {/* Header */}
                <div className={`p-4 border-b border-gray-100 flex justify-between items-center ${type === 'VENCE' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                        <span className={type === 'VENCE' ? 'text-vence' : 'text-perde'}>
                            Comprar {type} - {candidate.name}
                        </span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {step === 'QUANTITY' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-500 mb-2 font-medium">Quantidade de Tokens</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-3xl font-bold text-center focus:border-gray-400 outline-none text-gray-900"
                                    min="1"
                                />
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Preço Médio</span>
                                    <span className="text-gray-900 font-medium">R$ {averagePrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                                    <span className="text-gray-900">Total</span>
                                    <span className={type === 'VENCE' ? 'text-vence' : 'text-perde'}>
                                        R$ {total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('USER_INFO')}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-sm transition-transform active:scale-95 ${type === 'VENCE' ? 'bg-vence hover:bg-vence-dark' : 'bg-perde hover:bg-perde-dark'}`}
                            >
                                Continuar
                            </button>
                        </div>
                    )}
                    {step === 'USER_INFO' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">CPF</label>
                                <input
                                    type="text"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    placeholder="000.000.000-00"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 font-medium outline-none focus:border-gray-400 focus:bg-white transition-colors placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">WhatsApp</label>
                                <input
                                    type="text"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    placeholder="(11) 99999-9999"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 font-medium outline-none focus:border-gray-400 focus:bg-white transition-colors placeholder:text-gray-400"
                                />
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                <div className="text-xs text-yellow-700 leading-relaxed">
                                    <p className="font-bold text-yellow-800 mb-1">Aviso de Risco</p>
                                    Estes tokens são ativos de utilidade social e não representam investimento financeiro ou promessa de retorno.
                                </div>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer group p-1">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreed ? 'bg-gray-900 border-gray-900' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                                    {agreed && <CheckCircle size={14} className="text-white" />}
                                </div>
                                <input type="checkbox" className="hidden" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                                <span className="text-sm text-gray-500 font-medium group-hover:text-gray-900 transition-colors">
                                    Declaro que li e concordo com os termos.
                                </span>
                            </label>

                            <button
                                disabled={!agreed || !cpf || !whatsapp}
                                onClick={() => setStep('PAYMENT')}
                                className={`w-full py-3 rounded-lg font-bold text-black transition-all ${(!agreed || !cpf || !whatsapp) ? 'opacity-50 cursor-not-allowed bg-gray-500' : (type === 'VENCE' ? 'bg-vence hover:bg-vence/90' : 'bg-perde hover:bg-perde/90')}`}
                            >
                                Ir para Pagamento
                            </button>
                        </div>
                    )}

                    {step === 'PAYMENT' && (
                        <div className="text-center space-y-6">
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total a pagar</p>
                                <div className="text-4xl font-black text-gray-900">R$ {total.toFixed(2)}</div>
                            </div>

                            <div className="bg-white p-4 rounded-xl inline-block mx-auto border-4 border-gray-100 shadow-inner">
                                {/* Mock QR Code */}
                                <div className="w-48 h-48 bg-gray-900 flex items-center justify-center text-xs text-gray-400 font-mono break-all p-2 text-center">
                                    [QR CODE PIX MOCK]
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={copyPix}
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 transition-colors active:scale-95"
                                >
                                    <Copy size={18} />
                                    Copiar código PIX
                                </button>

                                {!loading ? (
                                    <button
                                        onClick={handlePayment}
                                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-vence/20 transition-transform active:scale-95 ${type === 'VENCE' ? 'bg-vence hover:bg-vence-dark' : 'bg-perde hover:bg-perde-dark'}`}
                                    >
                                        Simular Pagamento Confirmado
                                    </button>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 text-gray-500 py-3 font-medium bg-gray-50 rounded-xl">
                                        <Loader2 className="animate-spin" />
                                        Verificando pagamento...
                                    </div>
                                )}
                            </div>

                            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Expira em 04:59
                            </div>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="text-center py-8 space-y-6">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                                <CheckCircle size={40} />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-gray-900">Pagamento Confirmado!</h3>
                                <p className="text-gray-500 max-w-xs mx-auto">
                                    Seus <strong className="text-gray-900">{quantity} tokens {type}</strong> foram enviados para sua carteira vinculada ao WhatsApp <br /><strong className="text-gray-900">{whatsapp}</strong>.
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    const text = `Acabei de apostar que ${candidate.name} vai ${type}! 🚀 Confira em: https://quemvence.app`;
                                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                }}
                                className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-green-500/20"
                            >
                                Compartilhar no WhatsApp
                            </button>

                            <button
                                onClick={onClose}
                                className="px-8 py-3 text-gray-400 hover:text-gray-600 font-bold transition-colors text-sm uppercase tracking-wide"
                            >
                                Fechar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
