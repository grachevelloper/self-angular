import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BookApiService } from './book-api-service';
import { Book, CreateBookDTO, UpdateBookDTO } from '../../model';
import { apiBaseUrlProvider } from '../../../../shared/providers';

describe('BookApiService', () => {
    let service: BookApiService;
    let httpTesting: HttpTestingController;
    const apiUrl = 'http://localhost:8080/api/v1/books';
    const book: Book = {
        id: 'book-1',
        title: 'Clean Architecture',
        author: 'Robert C. Martin',
        status: 'reading',
        publishedAt: new Date('2017-09-20'),
        createdAt: new Date('2026-01-01'),
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting(), apiBaseUrlProvider],
        });
        service = TestBed.inject(BookApiService);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('loads all books from configured books endpoint', () => {
        const books: Book[] = [book];

        service.getAll().subscribe((result) => {
            expect(result).toEqual(books);
        });

        const request = httpTesting.expectOne(apiUrl);
        expect(request.request.method).toBe('GET');
        request.flush(books);
    });

    it('loads a book by id from configured books endpoint', () => {
        service.getById(book.id).subscribe((result) => {
            expect(result).toEqual(book);
        });

        const request = httpTesting.expectOne(`${apiUrl}/${book.id}`);
        expect(request.request.method).toBe('GET');
        request.flush(book);
    });

    it('creates a book at configured books endpoint', () => {
        const payload: CreateBookDTO = {
            title: book.title,
            author: book.author,
            status: book.status,
            publishedAt: book.publishedAt,
        };

        service.add(payload).subscribe((result) => {
            expect(result).toEqual(book);
        });

        const request = httpTesting.expectOne(apiUrl);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(payload);
        request.flush(book);
    });

    it('updates a book at configured book endpoint', () => {
        const payload: UpdateBookDTO = {
            status: 'finished',
        };
        const updatedBook: Book = {
            ...book,
            status: 'finished',
        };

        service.update(book.id, payload).subscribe((result) => {
            expect(result).toEqual(updatedBook);
        });

        const request = httpTesting.expectOne(`${apiUrl}/${book.id}`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(payload);
        request.flush(updatedBook);
    });

    it('deletes a book at configured book endpoint', () => {
        service.delete(book.id).subscribe((result) => {
            expect(result).toBeNull();
        });

        const request = httpTesting.expectOne(`${apiUrl}/${book.id}`);
        expect(request.request.method).toBe('DELETE');
        request.flush(null);
    });
});
