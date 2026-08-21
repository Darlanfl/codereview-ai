import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao fazer login.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">
                    CodeReview <span className="text-emerald-400">AI</span>
                </h1>

                <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 space-y-4">
                    <div>
                        <label className="block text-slate-300 text-sm mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm mb-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg py-2 transition disabled:opacity-50"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="text-slate-400 text-sm text-center mt-4">
                    Não tem conta?{' '}
                    <Link to="/register" className="text-emerald-400 hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;