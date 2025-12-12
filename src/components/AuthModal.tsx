import { useState, useEffect } from 'react';
import { X, Phone, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialView?: 'LOGIN' | 'REGISTER';
}

type View = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'OTP_VERIFY' | 'NEW_PASSWORD';

export function AuthModal({ isOpen, onClose, initialView = 'LOGIN' }: Props) {
    const { login, register, recover } = useAuth();
    const [view, setView] = useState<View>(initialView);

    // Form State
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setView(initialView);
            setName('');
            setMobile('');
            setPassword('');
            setConfirmPassword('');
            setOtp('');
            setError('');
            setLoading(false);
        }
    }, [isOpen, initialView]);

    if (!isOpen) return null;

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        setTimeout(async () => {
            const success = await login(mobile, password);
            setLoading(false);
            if (success) {
                onClose();
            } else {
                setError('Credenciais inválidas. Tente novamente.');
            }
        }, 1000);
    };

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        setLoading(true);
        setError('');
        setTimeout(async () => {
            const success = await register(name, mobile, password);
            setLoading(false);
            if (success) {
                onClose();
            } else {
                setError('Erro ao criar conta.');
            }
        }, 1000);
    };

    const handleRecover = async () => {
        setLoading(true);
        setError('');
        setTimeout(async () => {
            await recover(mobile);
            setLoading(false);
            setView('OTP_VERIFY');
        }, 1000);
    };

    const handleVerifyOtp = () => {
        if (otp === '1234') {
            setView('NEW_PASSWORD');
        } else {
            setError('Código inválido.');
        }
    };

    const handleResetPassword = () => {
        // Logic to actually reset password mock
        setView('LOGIN');
        setError('Senha alterada com sucesso! Faça login.');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-200 font-sans">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2">
                        {view !== 'LOGIN' && view !== initialView && (
                            <button onClick={() => setView('LOGIN')} className="text-gray-400 hover:text-gray-900 mr-1">
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        <h2 className="text-lg font-bold text-gray-900">
                            {view === 'LOGIN' && 'Entrar'}
                            {view === 'REGISTER' && 'Criar Conta'}
                            {view === 'FORGOT_PASSWORD' && 'Recuperar Senha'}
                            {view === 'OTP_VERIFY' && 'Verificar Código'}
                            {view === 'NEW_PASSWORD' && 'Nova Senha'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {/* View: LOGIN */}
                    {view === 'LOGIN' && (
                        <>
                            <div className="space-y-3">
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        placeholder="Celular (11) 99999-9999"
                                        value={mobile}
                                        onChange={e => setMobile(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 outline-none transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Senha"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={loading || !mobile || !password}
                                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
                            </button>

                            <p className="text-[10px] text-gray-400 text-center leading-tight px-4">
                                Ao entrar, você concorda com as <a href="#" className="underline">regras da plataforma</a>. Tokens são simbólicos e não têm valor financeiro real.
                            </p>

                            <div className="flex justify-between text-xs font-bold text-gray-500 pt-2">
                                <button onClick={() => setView('FORGOT_PASSWORD')} className="hover:text-gray-900">Esqueci minha senha</button>
                                <button onClick={() => setView('REGISTER')} className="text-vence hover:text-vence-dark">Criar conta</button>
                            </div>
                        </>
                    )}

                    {/* View: REGISTER */}
                    {view === 'REGISTER' && (
                        <>
                            <div className="space-y-3">
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Nome Completo"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 outline-none transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        placeholder="Celular"
                                        value={mobile}
                                        onChange={e => setMobile(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 outline-none transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Senha"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 outline-none transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Confirmar Senha"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleRegister}
                                disabled={loading || !name || !mobile || !password}
                                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Cadastrar'}
                            </button>

                            <p className="text-[10px] text-gray-400 text-center leading-tight px-4">
                                Ao cadastrar, você concorda com as <a href="#" className="underline">regras da plataforma</a>. Tokens são simbólicos e não têm valor financeiro real.
                            </p>
                        </>
                    )}

                    {/* View: FORGOT_PASSWORD */}
                    {view === 'FORGOT_PASSWORD' && (
                        <>
                            <div className="text-center pb-4">
                                <p className="text-sm text-gray-500">Digite seu celular para receber um código de recuperação.</p>
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="tel"
                                    placeholder="Celular"
                                    value={mobile}
                                    onChange={e => setMobile(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 outline-none transition-colors"
                                />
                            </div>
                            <button
                                onClick={handleRecover}
                                disabled={loading || !mobile}
                                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Enviar Código'}
                            </button>
                        </>
                    )}

                    {/* View: OTP_VERIFY */}
                    {(view === 'OTP_VERIFY' || view === 'NEW_PASSWORD') && (
                        <>
                            <div className="text-center pb-4">
                                <p className="text-sm text-gray-500">
                                    {view === 'OTP_VERIFY' ? 'Digite o código enviado.' : 'Defina sua nova senha.'}
                                </p>
                            </div>

                            {view === 'OTP_VERIFY' ? (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Código (1234)"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-xl tracking-widest font-mono focus:bg-white focus:border-gray-900 outline-none transition-colors"
                                    />
                                    <button
                                        onClick={handleVerifyOtp}
                                        className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
                                    >
                                        Verificar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="password"
                                        placeholder="Nova Senha"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-3 focus:bg-white focus:border-gray-900 outline-none transition-colors"
                                    />
                                    <button
                                        onClick={handleResetPassword}
                                        className="w-full py-3 bg-vence text-white font-bold rounded-xl hover:bg-vence-dark transition-colors"
                                    >
                                        Redefinir Senha
                                    </button>
                                </>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
