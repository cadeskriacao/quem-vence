import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    mobile: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (mobile: string, pass: string) => Promise<boolean>;
    register: (name: string, mobile: string, pass: string) => Promise<boolean>;
    recover: (mobile: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user_session');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (mobile: string, pass: string) => {
        // Mock login logic
        if (mobile === '11999999999' && pass === '123456') {
            const fakeUser = { id: '1', name: 'Usuário Demo', mobile };
            setUser(fakeUser);
            localStorage.setItem('user_session', JSON.stringify(fakeUser));
            return true;
        }
        // For MVP, actually just accept any valid-looking number that isn't specifically blocked
        if (mobile.length >= 10 && pass.length >= 4) {
            const fakeUser = { id: Date.now().toString(), name: 'Usuário Teste', mobile };
            setUser(fakeUser);
            localStorage.setItem('user_session', JSON.stringify(fakeUser));
            return true;
        }
        return false;
    };

    const register = async (name: string, mobile: string, _pass: string) => {
        // Mock register
        const newUser = { id: Date.now().toString(), name, mobile };
        setUser(newUser);
        localStorage.setItem('user_session', JSON.stringify(newUser));
        return true;
    };

    const recover = async (_mobile: string) => {
        // Mock OTP send
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user_session');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, recover, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
