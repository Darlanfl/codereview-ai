export interface AIFeedback {
    score: number;
    pontos_fortes: string[];
    sugestoes: string[];
    complexidade: 'baixa' | 'media' | 'alta';
}

export interface Snippet {
    id: number;
    title: string;
    language: string;
    code: string;
    description: string | null;
    aiStatus: 'pendente' | 'analisando' | 'concluido' | 'erro';
    aiScore: number | null;
    aiFeedback: AIFeedback | null;
    createdAt: string;
    User: {
        id: number;
        name: string;
    };
}