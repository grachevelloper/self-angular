import { Component, computed, signal, inject } from '@angular/core';
import { BookCardComponent } from './modules/books/components/book-card-component/book-card-component';
import { BookFiltersComponent } from './modules/books/components/book-filters-component/book-filters-component';
import { BOOKS_MOCK } from './modules/books/mocks';
import { Book, BookStatus } from './modules/books/model';
import { BookCreator, CreateBookDTO } from './modules/books/components/book-creator/book-creator';
import { BookService } from './modules/books/services';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.scss',
    imports: [BookCardComponent, BookFiltersComponent, BookCreator]
})
export class App {
    protected readonly booksService = inject(BookService)

    protected readonly searchQuery = signal('');

    protected readonly selectedStatus = signal<BookStatus | 'all'>('all');

    protected readonly filteredBooks = computed(() => {
        let filteredBooks = this.booksService.books();

        const query = this.searchQuery().trim().toLowerCase();

        const status = this.selectedStatus()

        if (query) {
            filteredBooks = filteredBooks.filter((book: Book) => {
                return book.author.toLowerCase().includes(query) ||
                    book.title.toLowerCase().includes(query)
            });
        }

        if (status === 'all') {
            return filteredBooks;
        }

        return filteredBooks.filter((book: Book) => book.status === status);

    });

    protected setStatus(newStatus: BookStatus): void {
        this.selectedStatus.update((currentStatus) =>
            currentStatus === newStatus ? 'all' : newStatus
        );
    }

    protected changeBookStatus(book: Book): void {
        this.booksService.changeBookStatus(book);
    }

    protected readonly isCreateBookModalOpen = signal<boolean>(false);

    protected onChangeBookModal(): void {
        this.isCreateBookModalOpen.update((current) => !current)
        return;
    }

    protected onSubmitBookModal(newBook?: CreateBookDTO): void {
        this.booksService.addBook(newBook);
        this.onChangeBookModal();
        return;
    }

}
