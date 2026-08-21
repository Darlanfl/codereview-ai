export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    userId: number;
    snippetId: number;
    User: {
        id: number;
        name: string;
    };
}