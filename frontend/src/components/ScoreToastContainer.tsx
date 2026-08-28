import ScoreToast from './ScoreToast';

export interface ToastData {
    id: number;
    title: string;
    score: number;
}

interface ScoreToastContainerProps {
    toasts: ToastData[];
    onClose: (id: number) => void;
}

function ScoreToastContainer({ toasts, onClose }: ScoreToastContainerProps) {
    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-3">
            {toasts.map((toast) => (
                <ScoreToast
                    key={toast.id}
                    id={toast.id}
                    title={toast.title}
                    score={toast.score}
                    onClose={onClose}
                />
            ))}
        </div>
    );
}

export default ScoreToastContainer;
