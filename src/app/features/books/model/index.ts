export * from './dto'

export type BookStatus = 'reading' | 'finished' | 'in_wishlist';

export interface Book {
    id: string;
    title: string;
    author: string;
    status: BookStatus;
    publishedAt: Date;
    createdAt: Date
    updatedAt?: Date
}

export type BookFilter = BookStatus | 'all';


