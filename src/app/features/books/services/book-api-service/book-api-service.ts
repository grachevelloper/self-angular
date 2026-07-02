import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../../shared/providers';
import { Book, CreateBookDTO, UpdateBookDTO } from '../../model';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BookApiService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${inject(API_BASE_URL)}/books`;

    getAll(): Observable<Book[]> {
        return this.http.get<Book[]>(this.apiUrl);
    }

    getById(id: string): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/${id}`);
    }

    add(book: CreateBookDTO): Observable<Book> {
        return this.http.post<Book>(this.apiUrl, book);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    update(id: string, book: UpdateBookDTO): Observable<Book> {
        return this.http.post<Book>(`${this.apiUrl}/${id}`, book);
    }
}
