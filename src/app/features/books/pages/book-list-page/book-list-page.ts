import { Component, computed, inject, signal } from '@angular/core';
import { BookCardComponent } from '../../components/book-card-component/book-card-component';
import { BookCreatorComponent, CreateBookDTO } from '../../components/book-creator-component/book-creator-component';
import { BookFiltersComponent } from '../../components/book-filters-component/book-filters-component';
import { BookStatus, Book, BookFilter } from '../../model';
import { BookService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-book-list-page',
    imports: [BookCardComponent, BookFiltersComponent, BookCreatorComponent],
    templateUrl: './book-list-page.html',
    styleUrl: './book-list-page.scss',
})
export class BookListPage {
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private queryParamMap = toSignal(this.activatedRoute.queryParamMap);

    public readonly booksService = inject(BookService)

    protected searchQuery = computed(() => {
        return this.queryParamMap()?.get('search') ?? '';
    });
    protected selectedStatus = computed(() => {
        return this.getInitialStatus(this.queryParamMap()?.get('status'));
    });


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

    protected handleChangeSearch(search: string): void {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { search: search || null, page: 1 },
            queryParamsHandling: 'merge'
        })
    }

    protected handleChangeStatus(status: BookStatus): void {
        let newStatus = status as BookFilter | undefined;
        if (status === this.selectedStatus()) {
            newStatus = undefined
        }
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { status: newStatus, page: 1 },
            queryParamsHandling: 'merge'
        })
    }

    protected changeBookStatus(book: Book): void {
        this.booksService.changeBookStatus(book);
    }

    protected readonly isCreateBookModalOpen = signal<boolean>(false);

    protected onChangeBookModal(): void {
        this.isCreateBookModalOpen.update((current) => !current)
        return;
    }

    protected onSubmitBookModal(newBook: CreateBookDTO): void {
        this.booksService.addBook(newBook).subscribe({
            next: () => this.onChangeBookModal(),
        });
        return;
    }

    protected deleteBook(book: Book): void {
        this.booksService.deleteBookById(book.id).subscribe();
    }

    protected handleBookClick(id: number): void {
        this.router.navigateByUrl(`/${String(id)}`)
    }

    private getInitialStatus(status?: string | null): BookFilter {
        switch (status) {
            case 'wishlist':
            case 'reading':
            case 'finished':
                return status;
            default:
                return 'all'
        }
    }
}
