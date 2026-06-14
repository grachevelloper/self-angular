import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { BookListPage } from './pages/book-list-page/book-list-page';
import { BookDetailsPage } from './pages/book-details-page/book-details-page';
import { Book } from './model';
import { BookService } from './services';
import { inject } from '@angular/core';

const bookResolver: ResolveFn<Book | undefined> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const bookService = inject(BookService);
    const bookId = Number(route.paramMap.get('id')!);
    if (Number.isNaN(bookId)) {
        return undefined;
    }

    return bookService.resolveBookById(bookId);
}


export const BOOKS_ROUTES: Routes = [
    {
        path: '',
        component: BookListPage,
        title: "Мои книги"
    },
    {
        path: ':id',
        component: BookDetailsPage,
        resolve: {
            book: bookResolver
        }
    }
]


