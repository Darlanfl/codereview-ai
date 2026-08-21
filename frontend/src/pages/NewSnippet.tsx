import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'csharp', 'php', 'go', 'other'];

function NewSnippet() {
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/snippets', { title, language, code, description });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao criar snippet.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-black px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Novo Snippet</h1>

                <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-xl p-6 space-y-4">
                    <div>
                        <label className="block text-zinc-300 text-sm mb-1">Título</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="Ex: Função de debounce"
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-300 text-sm mb-1">Linguagem</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-zinc-300 text-sm mb-1">Descrição (opcional)</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="O que esse código faz?"
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-300 text-sm mb-1">Código</label>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            rows={10}
                            className="w-full bg-zinc-950 text-slate-200 font-mono text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="Cole seu código aqui..."
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg py-2 transition disabled:opacity-50"
                    >
                        {loading ? 'Publicando...' : 'Publicar Snippet'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewSnippet;