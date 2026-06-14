import {
    // inject,
    Injectable
} from '@angular/core';
// import { baseUrl } from '../../../../shared/constants';
import { Book } from '../../model';
// import { HttpClient } from '@angular/common/http';
import { CreateBookDTO, UpdateBookDTO } from '../../components/book-creator-component/book-creator-component';
import { delay, Observable, of, throwError } from 'rxjs';
import { BOOKS_MOCK } from '../../mocks';

@Injectable({
    providedIn: 'root',
})
export class BookApiService {
    // private readonly http = inject(HttpClient);
    // private readonly baseUrl = baseUrl + '/books';

    private books: Book[] = BOOKS_MOCK;

    getAll(): Observable<Book[]> {
        // Mocks
        return of(this.books).pipe(
            delay(1000)
        )
        // Mocks
        // return this.http.get<Book[]>(this.baseUrl);
    }

    getById(id: number): Observable<Book | undefined> {
        // Mocks

        return of(this.books.find((book) => book.id === id)).pipe(
            delay(2000)
        )
        // Mocks
        // return this.http.get<Book>(`${this.baseUrl}/${id}`);
    }

    add(book: CreateBookDTO): Observable<Book> {
        // Mocks
        const newBook = { ...book, id: Date.now() }
        this.books = [...this.books, newBook];
        return of(newBook).pipe(
            delay(1000)
        )
        // Mocks
        // return this.http.post<Book>(this.baseUrl, book);
    }

    deleteById(id: number): Observable<void> {
        // Mocks
        const oldBook = this.books.find((book) => book.id === id);
        if (!oldBook) {
            return throwError(() => new Error(`Book with id ${id} not found`));
        }

        this.books = this.books.filter((book) => book.id !== id);

        return of(void 0).pipe(
            delay(500)
        )
        // Mocks
        // return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    updateById(id: number, book: UpdateBookDTO): Observable<Book> {
        // Mocks
        const oldBook = this.books.find((book) => book.id === id);
        if (!oldBook) {
            return throwError(() => new Error(`Book with id ${id} not found`));
        }


        const newBook = { ...oldBook, ...book, id };
        this.books = this.books.map((book) => book.id === id ? newBook : book);

        return of(newBook).pipe(delay(100))
        // Mocks
        // return this.http.patch<Book>(`${this.baseUrl}/${id}`, book);
    }
}
