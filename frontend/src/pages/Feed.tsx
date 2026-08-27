import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import socket from '../services/socket';
import { useAuth } from '../contexts/AuthContext';
import SnippetCard from '../components/SnippetCard';
import MatrixRain from '../components/MatrixRain';
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
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Efeito Matrix: chuva de código binário */}
            <MatrixRain />

            {/* Conteúdo real, por cima do efeito */}
            <div className="relative z-10">
                <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between bg-black/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-xl text-white">
                            <span className="text-emerald-400">&gt;</span> CodeReview_
                            <span className="animate-pulse text-emerald-400 font-bold inline-block">
                                AI
                            </span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            IA online
                        </span>

                        {user ? (
                            <>
                                <Link
                                    to="/new"
                                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg px-4 py-2 text-sm transition font-mono"
                                >
                                    + novo_snippet
                                </Link>
                                <span className="text-zinc-400 text-sm font-mono">
                                    ~/{user.name.toLowerCase().split(' ')[0]}
                                </span>
                                <button
                                    onClick={logout}
                                    className="text-zinc-500 hover:text-white text-sm font-mono"
                                >
                                    exit
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="text-emerald-400 text-sm hover:underline font-mono"
                            >
                                login
                            </Link>
                        )}
                    </div>
                </header>

                <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
                    {loading && <p className="text-zinc-400">Carregando snippets...</p>}

                    {!loading && snippets.length === 0 && (
                        <p className="text-zinc-400">Nenhum snippet postado ainda.</p>
                    )}

                    {snippets.map((snippet) => (
                        <SnippetCard key={snippet.id} snippet={snippet} />
                    ))}
                </main>
            </div>
        </div>
    );
}

export default Feed;
