import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import socket from '../services/socket';
import { useAuth } from '../contexts/AuthContext';
import SnippetCard from '../components/SnippetCard';
import type { Snippet } from '../types/snippet';

function Feed() {
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();

    async function loadSnippets() {
        try {
            const response = await api.get('/snippets');
            setSnippets(response.data);
        } catch (err) {
            console.error('Erro ao carregar snippets:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSnippets();

        function handleUpdate(updatedSnippet: Snippet) {
            setSnippets((prev) =>
                prev.map((s) =>
                    s.id === updatedSnippet.id ? { ...s, ...updatedSnippet } : s
                )
            );
        }

        socket.on('snippet:updated', handleUpdate);

        return () => {
            socket.off('snippet:updated', handleUpdate);
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-900">
            <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">
                    CodeReview <span className="text-emerald-400">AI</span>
                </h1>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                to="/new"
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg px-4 py-2 text-sm transition"
                            >
                                + Novo Snippet
                            </Link>
                            <span className="text-slate-300 text-sm">Olá, {user.name}</span>
                            <button
                                onClick={logout}
                                className="text-slate-400 hover:text-white text-sm"
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="text-emerald-400 text-sm hover:underline">
                            Entrar
                        </Link>
                    )}
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
                {loading && <p className="text-slate-400">Carregando snippets...</p>}

                {!loading && snippets.length === 0 && (
                    <p className="text-slate-400">Nenhum snippet postado ainda.</p>
                )}

                {snippets.map((snippet) => (
                    <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
            </main>
        </div>
    );
}

export default Feed;