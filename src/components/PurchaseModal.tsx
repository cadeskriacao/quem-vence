
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
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-[#141414] border border-white/10 rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-200">

                {/* Header */}
                <div className={`p-4 border-b border-white/5 flex justify-between items-center ${type === 'VENCE' ? 'bg-vence/5' : 'bg-perde/5'}`}>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <span className={type === 'VENCE' ? 'text-vence' : 'text-perde'}>
                            Comprar {type} - {candidate.name}
                        </span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {step === 'QUANTITY' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Quantidade de Tokens</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-3xl font-bold text-center focus:border-vence/50 outline-none"
                                    min="1"
                                />
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Preço Médio</span>
                                    <span>R$ {averagePrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                                    <span>Total</span>
                                    <span className={type === 'VENCE' ? 'text-vence' : 'text-perde'}>
                                        R$ {total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('USER_INFO')}
                                className={`w-full py-4 rounded-xl font-bold text-black transition-transform active:scale-95 ${type === 'VENCE' ? 'bg-vence hover:bg-vence/90' : 'bg-perde hover:bg-perde/90'}`}
                            >
                                Continuar
                            </button>
                        </div>
                    )}

                    {step === 'USER_INFO' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">CPF</label>
                                <input
                                    type="text"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    placeholder="000.000.000-00"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-white/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">WhatsApp</label>
                                <input
                                    type="text"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    placeholder="(11) 99999-9999"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-white/30"
                                />
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                <div className="text-xs text-yellow-200/80">
                                    <p className="font-bold text-yellow-500 mb-1">Aviso de Risco</p>
                                    Estes tokens são ativos de utilidade social e não representam investimento financeiro ou promessa de retorno.
                                </div>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreed ? 'bg-vence border-vence' : 'border-gray-600'}`}>
                                    {agreed && <CheckCircle size={14} className="text-black" />}
                                </div>
                                <input type="checkbox" className="hidden" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                                <span className="text-sm text-gray-400 group-hover:text-gray-300">
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
                                <p className="text-sm text-gray-400">Total a pagar</p>
                                <div className="text-3xl font-bold text-white">R$ {total.toFixed(2)}</div>
                            </div>

                            <div className="bg-white p-4 rounded-xl inline-block mx-auto">
                                {/* Mock QR Code */}
                                <div className="w-48 h-48 bg-black/10 flex items-center justify-center text-xs text-black font-mono break-all">
                                    [QR CODE PIX MOCK]
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={copyPix}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Copy size={16} />
                                    Copiar código PIX
                                </button>

                                {!loading ? (
                                    <button
                                        onClick={handlePayment}
                                        className={`w-full py-3 rounded-lg font-bold text-black ${type === 'VENCE' ? 'bg-vence' : 'bg-perde'}`}
                                    >
                                        Simular Pagamento Confirmado
                                    </button>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 text-gray-400 py-3">
                                        <Loader2 className="animate-spin" />
                                        Verificando pagamento...
                                    </div>
                                )}
                            </div>

                            <div className="text-xs text-gray-500">
                                Expira em 04:59
                            </div>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="text-center py-8 space-y-4">
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Pagamento Confirmado!</h3>
                            <p className="text-gray-400">
                                Seus <strong>{quantity} tokens {type}</strong> foram enviados para sua carteira vinculada ao WhatsApp <strong>{whatsapp}</strong>.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-6 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors"
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
