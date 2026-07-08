import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../../shared/providers';
import { Book, BookSortField, CreateBookDTO, UpdateBookDTO } from '../../model';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../../../shared/types';
import { PaginatedQuery } from '../../../../shared/types/dto';

@Injectable({
    providedIn: 'root',
})
export class BookApiService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${inject(API_BASE_URL)}/books`;

    getAll({
        page, limit, sortField, order
    }: PaginatedQuery<BookSortField>): Observable<PaginatedResponse<Book>> {
        return this.http.get<PaginatedResponse<Book>>(this.apiUrl, {
            params: { page, limit, sort_field: sortField, order }
        });
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
