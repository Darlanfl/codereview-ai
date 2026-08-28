import { useEffect, useState } from 'react';

interface ScoreToastProps {
    id: number;
    title: string;
    score: number;
    onClose: (id: number) => void;
}

function scoreColor(score: number) {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
}

function scoreGlow(score: number) {
    if (score >= 70) return 'shadow-[0_0_40px_rgba(16,185,129,0.4)] border-emerald-500/50';
    if (score >= 40) return 'shadow-[0_0_40px_rgba(245,158,11,0.4)] border-amber-500/50';
    return 'shadow-[0_0_40px_rgba(239,68,68,0.4)] border-red-500/50';
}

function ScoreToast({ id, title, score, onClose }: ScoreToastProps) {
    const [displayScore, setDisplayScore] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // dispara a entrada (fade + slide)
        const enterTimer = setTimeout(() => setVisible(true), 50);

        // contagem crescente do número, do 0 até o score real
        const duration = 2000; // ms
        const steps = 30;
        const increment = score / steps;
        let current = 0;
        let stepCount = 0;

        const countInterval = setInterval(() => {
            stepCount++;
            current = Math.min(score, Math.round(increment * stepCount));
            setDisplayScore(current);
            if (stepCount >= steps) clearInterval(countInterval);
        }, duration / steps);

        // some sozinho depois de alguns segundos
        const dismissTimer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onClose(id), 400);
        }, 8000);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(dismissTimer);
            clearInterval(countInterval);
        };
    }, [id, score, onClose]);

    return (
        <div
            className={`font-mono bg-zinc-900 border rounded-xl p-4 w-72 transition-all duration-400 ${scoreGlow(
                score
            )} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
        >
            <p className="text-emerald-400 text-xs mb-1">
                &gt; análise_concluída
            </p>
            <p className="text-zinc-300 text-sm truncate mb-2">{title}</p>

            <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold tabular-nums ${scoreColor(score)}`}>
                    {displayScore}
                </span>
                <span className="text-zinc-500 text-sm">/100</span>
            </div>
        </div>
    );
}

export default ScoreToast;
