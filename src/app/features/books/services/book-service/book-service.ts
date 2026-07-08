import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, defer, EMPTY, finalize, Observable, of, tap } from 'rxjs';
import { Book, BookSortField, CreateBookDTO, UpdateBookDTO } from '../../model';
import { BookApiService } from '../book-api-service/book-api-service';
import { PaginatedQuery } from '../../../../shared/types/dto';

type BookState = {
    books: Book[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
};

@Injectable({
    providedIn: 'root',
})
export class BookService {
    private readonly api = inject(BookApiService);

    private readonly booksState = signal<BookState>({
        books: [],
        total: 0,
        page: 1,
        limit: 10,
        hasNext: false,
    });
    private readonly currentBookState = signal<Book | undefined>(undefined);
    private readonly updatingBookIdsState = signal<Set<string>>(new Set());
    private readonly deletingBookIdsState = signal<Set<string>>(new Set());

    public readonly books = computed(() => this.booksState().books);
    public readonly totalBooks = computed(() => this.booksState().total);
    public readonly hasNextBooks = computed(() => this.booksState().hasNext);
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

    public loadBooks({ page, limit, sortField, order }: PaginatedQuery<BookSortField>): void {
        this.loadingBooks.set(true);
        this.loadBooksError.set(null);

        if (limit < this.booksState().limit) {
            this.booksState.update((prev) => ({
                ...prev,
                limit,
                books: this.booksState().books.slice(limit),
            }))
            this.loadingBooks.set(false)
        } else {
            this.api
                .getAll({ page, limit, sortField, order })
                .pipe(finalize(() => this.loadingBooks.set(false)))
                .subscribe({
                    next: (res) =>
                        this.booksState.set({
                            books: res.items ?? [],
                            total: res.total,
                            page: res.page,
                            limit: res.limit,
                            hasNext: res.has_next,
                        }),
                    error: () => this.loadBooksError.set('Не удалось загрузить книги'),
                });
        }
    }

    public loadBookById(id: string): void {
        this.loadBookByIdRequest(id).subscribe();
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
            finalize(() => this.loadingCurrentBook.set(false)),
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

    public updateBookById(bookId: string, updates: UpdateBookDTO): Observable<Book> {
        return defer(() => {
            this.updateError.set(null);
            this.addPendingId(this.updatingBookIdsState, bookId);

            return this.api.update(bookId, updates).pipe(
                tap((updatedBook) => {
                    this.booksState.update((state) => ({
                        ...state,
                        books: state.books.map((book) =>
                            book.id === updatedBook.id ? updatedBook : book,
                        ),
                    }));
                    this.currentBookState.update((book) =>
                        book?.id === updatedBook.id ? updatedBook : book,
                    );
                }),
                catchError(() => {
                    this.updateError.set('Не удалось обновить книгу');
                    return EMPTY;
                }),
                finalize(() => this.removePendingId(this.updatingBookIdsState, bookId)),
            );
        });
    }

    public addBook(newBook: CreateBookDTO): Observable<Book> {
        return defer(() => {
            this.creatingBook.set(true);
            this.createError.set(null);

            return this.api.add(newBook).pipe(
                tap((createdBook) => {
                    this.booksState.update((state) => ({
                        ...state,
                        books: [...state.books, createdBook],
                        total: state.total + 1,
                    }));
                }),
                catchError(() => {
                    this.createError.set('Не удалось создать книгу');
                    return EMPTY;
                }),
                finalize(() => this.creatingBook.set(false)),
            );
        });
    }

    public deleteBookById(bookId: string): Observable<void> {
        return defer(() => {
            this.deleteError.set(null);
            this.addPendingId(this.deletingBookIdsState, bookId);

            return this.api.delete(bookId).pipe(
                tap(() => {
                    this.booksState.update((state) => ({
                        ...state,
                        books: state.books.filter((book) => book.id !== bookId),
                        total: Math.max(0, state.total - 1),
                    }));
                }),
                catchError(() => {
                    this.deleteError.set('Не удалось удалить книгу');
                    return EMPTY;
                }),
                finalize(() => this.removePendingId(this.deletingBookIdsState, bookId)),
            );
        });
    }

    public getBookById(id: string): Book | undefined {
        return this.booksState().books.find((book) => book.id === id);
    }

    private addPendingId(state: WritableSignal<Set<string>>, id: string): void {
        state.update((ids) => {
            const nextIds = new Set(ids);
            nextIds.add(id);
            return nextIds;
        });
    }

    private removePendingId(state: WritableSignal<Set<string>>, id: string): void {
        state.update((ids) => {
            const nextIds = new Set(ids);
            nextIds.delete(id);
            return nextIds;
        });
    }
}
