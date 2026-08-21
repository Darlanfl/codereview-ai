import type { Snippet } from '../types/snippet';
import { Link } from 'react-router-dom';

function statusBadge(status: Snippet['aiStatus']) {
    const map = {
        pendente: { text: 'Aguardando análise', color: 'bg-slate-600' },
        analisando: { text: 'Analisando...', color: 'bg-amber-600' },
        concluido: { text: 'Analisado', color: 'bg-emerald-600' },
        erro: { text: 'Erro na análise', color: 'bg-red-600' },
    };
    return map[status];
}

function scoreColor(score: number) {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
}

function SnippetCard({ snippet }: { snippet: Snippet }) {
    const badge = statusBadge(snippet.aiStatus);

    return (
        <Link
            to={`/snippet/${snippet.id}`}
            className="block bg-slate-800 rounded-xl p-5 space-y-3 hover:bg-slate-750 transition cursor-pointer"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-white font-semibold text-lg">{snippet.title}</h3>
                    <p className="text-slate-400 text-sm">
                        por {snippet.User.name} · {snippet.language}
                    </p>
                </div>

                <span className={`text-xs text-white px-2 py-1 rounded-full ${badge.color}`}>
                    {badge.text}
                </span>
            </div>

            {snippet.description && (
                <p className="text-slate-300 text-sm">{snippet.description}</p>
            )}

            <pre className="bg-slate-950 text-slate-200 text-sm rounded-lg p-3 overflow-x-auto">
                <code>{snippet.code}</code>
            </pre>

            {snippet.aiStatus === 'concluido' && snippet.aiFeedback && (
                <div className="bg-slate-900 rounded-lg p-4 space-y-2 border border-slate-700">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">Score de qualidade:</span>
                        <span className={`font-bold text-lg ${scoreColor(snippet.aiScore ?? 0)}`}>
                            {snippet.aiScore}/100
                        </span>
                    </div>

                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">✅ Pontos fortes</p>
                        <ul className="text-slate-300 text-sm list-disc list-inside space-y-0.5">
                            {snippet.aiFeedback.pontos_fortes.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">💡 Sugestões</p>
                        <ul className="text-slate-300 text-sm list-disc list-inside space-y-0.5">
                            {snippet.aiFeedback.sugestoes.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </Link>
    );
}

export default SnippetCard;