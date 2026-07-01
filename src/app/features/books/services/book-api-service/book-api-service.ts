import {
    inject,
    Injectable
} from '@angular/core';
import { BASE_URL } from '../../../../shared/constants';
import { Book } from '../../model';
import { HttpClient } from '@angular/common/http';
import { CreateBookDTO, UpdateBookDTO } from '../../components/book-creator-component/book-creator-component';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class BookApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = BASE_URL + '/books';


    getAll(): Observable<Book[]> {
        return this.http.get<Book[]>(this.baseUrl);
    }

    getById(id: string): Observable<Book | undefined> {
        return this.http.get<Book>(`${this.baseUrl}/${id}`);
    }

    add(book: CreateBookDTO): Observable<Book> {

        return this.http.post<Book>(this.baseUrl, book);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    update(id: string, book: UpdateBookDTO): Observable<Book> {
        return this.http.post<Book>(`${this.baseUrl}/${id}`, book);
    }
}
