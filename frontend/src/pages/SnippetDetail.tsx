import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import socket from '../services/socket';
import { useAuth } from '../contexts/AuthContext';
import SnippetCard from '../components/SnippetCard';
import MatrixRain from '../components/MatrixRain';
import type { Snippet } from '../types/snippet';
import type { Comment } from '../types/comment';

function SnippetDetail() {
    const { id } = useParams();
    const { user } = useAuth();

    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    async function loadData() {
        try {
            const [snippetRes, commentsRes] = await Promise.all([
                api.get(`/snippets/${id}`),
                api.get(`/comments/${id}`),
            ]);
            setSnippet(snippetRes.data);
            setComments(commentsRes.data);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();

        function handleSnippetUpdate(updated: Snippet) {
            if (String(updated.id) === id) {
                setSnippet((prev) => (prev ? { ...prev, ...updated } : updated));
            }
        }

        function handleCommentCreated(comment: Comment) {
            if (String(comment.snippetId) === id) {
                setComments((prev) => [...prev, comment]);
            }
        }

        socket.on('snippet:updated', handleSnippetUpdate);
        socket.on('comment:created', handleCommentCreated);

        return () => {
            socket.off('snippet:updated', handleSnippetUpdate);
            socket.off('comment:created', handleCommentCreated);
        };
    }, [id]);

    async function handleCommentSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSending(true);
        try {
            await api.post(`/comments/${id}`, { content: newComment });
            setNewComment('');
        } catch (err) {
            console.error('Erro ao comentar:', err);
        } finally {
            setSending(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
                <MatrixRain />
                <p className="relative z-10 text-zinc-400">Carregando...</p>
            </div>
        );
    }

    if (!snippet) {
        return (
            <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
                <MatrixRain />
                <p className="relative z-10 text-zinc-400">Snippet não encontrado.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            <MatrixRain />

            <div className="relative z-10">
                <header className="border-b border-zinc-800 px-6 py-4 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
                    <Link to="/" className="text-emerald-400 text-sm hover:underline font-mono">
                        ← voltar_ao_feed
                    </Link>
                </header>

                <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
                    <SnippetCard snippet={snippet} />

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                        <h2 className="text-white font-semibold mb-4">
                            Comentários ({comments.length})
                        </h2>

                        <div className="space-y-3 mb-4">
                            {comments.length === 0 && (
                                <p className="text-zinc-400 text-sm">Nenhum comentário ainda. Seja o primeiro!</p>
                            )}

                            {comments.map((comment) => (
                                <div key={comment.id} className="bg-black border border-zinc-800 rounded-lg p-3">
                                    <p className="text-emerald-400 text-sm font-medium">{comment.User.name}</p>
                                    <p className="text-zinc-300 text-sm mt-1">{comment.content}</p>
                                </div>
                            ))}
                        </div>

                        {user ? (
                            <form onSubmit={handleCommentSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Escreva um comentário..."
                                    className="flex-1 bg-zinc-800 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg px-4 py-2 text-sm transition disabled:opacity-50"
                                >
                                    {sending ? '...' : 'Enviar'}
                                </button>
                            </form>
                        ) : (
                            <p className="text-zinc-400 text-sm">
                                <Link to="/login" className="text-emerald-400 hover:underline">
                                    Faça login
                                </Link>{' '}
                                para comentar.
                            </p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SnippetDetail;
