import { X, Clock } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
}

export function ComingSoonModal({ isOpen, onClose, title }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center font-sans">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Clock size={32} />
                </div>

                <h2 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                    {title}
                </h2>
                <p className="text-gray-500 font-medium mb-6">
                    Esta categoria será liberada na próxima fase da simulação.
                </p>

                <button
                    onClick={onClose}
                    className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-transform active:scale-95"
                >
                    Entendido
                </button>
            </div>
        </div>
    );
}
