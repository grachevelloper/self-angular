import { Injectable, signal } from '@angular/core';
import { CreateBookDTO } from '../components/book-creator/book-creator';
import { BOOKS_MOCK } from '../mocks';
import { Book } from '../model';

@Injectable({
    providedIn: 'root',
})
export class BookService {
    private readonly booksState = signal<Book[]>(BOOKS_MOCK);
    public readonly books = this.booksState.asReadonly();


    public changeBookStatus(book: Book): void {
        const { id, status } = book;
        switch (status) {
            case 'finished':
                this.updateBookById(id, { status: 'wishlist' })
                return;
            case 'wishlist':
                this.updateBookById(id, { status: 'reading' })
                return;
            case 'reading':
                this.updateBookById(id, { status: 'finished' })
                return;
        }
    }

    public updateBookById<K extends keyof Book>(
        bookId: number,
        updates: Partial<Book>
    ): void {
        this.booksState.update((list: Book[]) =>
            list.map(currentBook =>
                currentBook.id === bookId
                    ? { ...currentBook, ...updates }
                    : currentBook
            )
        )
        return;
    }

    public addBook(newBook?: CreateBookDTO): void {
        if (!newBook) return;

        const lastId = this.booksState().at(-1)?.id || 0
        this.booksState.update(books =>
            [...books, { ...newBook, id: lastId + 1 }])
    }

}
