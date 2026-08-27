import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MatrixRain from '../components/MatrixRain';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(name, email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao cadastrar.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4">
            <MatrixRain />

            <div className="relative z-10 w-full max-w-sm">
                <h1 className="font-mono text-3xl text-white mb-8 text-center">
                    <span className="text-emerald-400">&gt;</span> CodeReview_
                    <span className="text-emerald-400 font-bold">AI</span>
                </h1>

                <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                    <div>
                        <label className="block text-zinc-300 text-sm mb-1">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="Seu nome"
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-300 text-sm mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-300 text-sm mb-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg py-2 transition disabled:opacity-50"
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <p className="text-zinc-400 text-sm text-center mt-4">
                    Já tem conta?{' '}
                    <Link to="/login" className="text-emerald-400 hover:underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
