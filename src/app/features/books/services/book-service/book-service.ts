import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, defer, EMPTY, finalize, Observable, of, tap } from 'rxjs';
import { CreateBookDTO, UpdateBookDTO } from '../../components/book-creator-component/book-creator-component';
import { Book } from '../../model';
import { BookApiService } from '../book-api-service/book-api-service';

@Injectable({
    providedIn: 'root',
})
export class BookService {
    private readonly api = inject(BookApiService);

    private readonly booksState = signal<Book[]>([]);
    private readonly currentBookState = signal<Book | undefined>(undefined);
    private readonly updatingBookIdsState = signal<Set<string>>(new Set());
    private readonly deletingBookIdsState = signal<Set<string>>(new Set());

    public readonly books = this.booksState.asReadonly();
    public readonly currentBook = this.currentBookState.asReadonly();
    public readonly updatingBookIds = this.updatingBookIdsState.asReadonly();
    public readonly deletingBookIds = this.deletingBookIdsState.asReadonly();

    public readonly loadingBooks = signal(false);
    public readonly loadingCurrentBook = signal(false);
    public readonly creatingBook = signal(false);

    public readonly loadCurrentBookError = signal<string | null>(null);
    public readonly loadBooksError = signal<string | null>(null);
    public readonly createError = signal<string | null>(null);
    public readonly updateError = signal<string | null>(null);
    public readonly deleteError = signal<string | null>(null);

    public readonly actionError = computed(() => {
        return this.createError() ?? this.updateError() ?? this.deleteError();
    });

    constructor() {
        this.loadBooks();
    }

    public loadBooks(): void {
        this.loadingBooks.set(true);
        this.loadBooksError.set(null);

        this.api.getAll()
            .pipe(finalize(() => this.loadingBooks.set(false)))
            .subscribe({
                next: (books) => this.booksState.set(books),
                error: () => this.loadBooksError.set('Не удалось загрузить книги'),
            });
    }

    public loadBookById(id: string): void {
        this.loadBookByIdRequest(id).subscribe()

    }

    private loadBookByIdRequest(id: string): Observable<Book | undefined> {
        this.loadingCurrentBook.set(true);
        this.loadCurrentBookError.set(null);

        return this.api.getById(id).pipe(
            tap((book) => this.currentBookState.set(book)),
            catchError(() => {
                this.loadCurrentBookError.set('Не удалось загрузить книгу');
                return of(undefined);
            }),
            finalize(() => this.loadingCurrentBook.set(false))
        );
    }

    public resolveBookById(id: string): Observable<Book | undefined> {
        return this.loadBookByIdRequest(id);
    }


    public changeBookStatus(book: Book): void {
        const { id, status } = book;

        switch (status) {
            case 'finished':
                this.updateBookById(id, { status: 'in_wishlist' }).subscribe();
                return;
            case 'in_wishlist':
                this.updateBookById(id, { status: 'reading' }).subscribe();
                return;
            case 'reading':
                this.updateBookById(id, { status: 'finished' }).subscribe();
                return;
        }
    }

    public updateBookById(
        bookId: string,
        updates: UpdateBookDTO
    ): Observable<Book> {
        return defer(() => {
            this.updateError.set(null);
            this.addPendingId(this.updatingBookIdsState, bookId);

            return this.api.update(bookId, updates).pipe(
                tap((updatedBook) => {
                    this.booksState.update((books) =>
                        books.map((book) => book.id === updatedBook.id ? updatedBook : book)
                    );
                }),
                catchError(() => {
                    this.updateError.set('Не удалось обновить книгу');
                    return EMPTY;
                }),
                finalize(() => this.removePendingId(this.updatingBookIdsState, bookId))
            );
        });
    }

    public addBook(newBook: CreateBookDTO): Observable<Book> {
        return defer(() => {
            this.creatingBook.set(true);
            this.createError.set(null);

            return this.api.add(newBook).pipe(
                tap((createdBook) => {
                    this.booksState.update((books) => [...books, createdBook]);
                }),
                catchError(() => {
                    this.createError.set('Не удалось создать книгу');
                    return EMPTY;
                }),
                finalize(() => this.creatingBook.set(false))
            );
        });
    }

    public deleteBookById(bookId: string): Observable<void> {
        return defer(() => {
            this.deleteError.set(null);
            this.addPendingId(this.deletingBookIdsState, bookId);

            return this.api.delete(bookId).pipe(
                tap(() => {
                    this.booksState.update((books) =>
                        books.filter((book) => book.id !== bookId)
                    );
                }),
                catchError(() => {
                    this.deleteError.set('Не удалось удалить книгу');
                    return EMPTY;
                }),
                finalize(() => this.removePendingId(this.deletingBookIdsState, bookId))
            );
        });
    }

    public getBookById(id: string): Book | undefined {
        return this.booksState().find((book) => book.id === id);
    }

    private addPendingId(
        state: WritableSignal<Set<string>>,
        id: string
    ): void {
        state.update((ids) => {
            const nextIds = new Set(ids);
            nextIds.add(id);
            return nextIds;
        });
    }

    private removePendingId(
        state: WritableSignal<Set<string>>,
        id: string
    ): void {
        state.update((ids) => {
            const nextIds = new Set(ids);
            nextIds.delete(id);
            return nextIds;
        });
    }
}
