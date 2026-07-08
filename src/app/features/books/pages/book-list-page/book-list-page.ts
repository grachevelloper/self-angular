import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { BookStatus, Book, BookFiltered, BookSortField, CreateBookDTO } from '../../model';
import { BookService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BookCreatorComponent } from './components/book-creator-component/book-creator-component';
import { BookFiltersComponent } from './components/book-filters-component/book-filters-component';
import { SortOrder } from '../../../../shared/types';
import { BookListComponent } from './components/book-list-component/book-list-component';

@Component({
    selector: 'book-list-page',
    imports: [BookFiltersComponent, BookCreatorComponent, BookListComponent],
    templateUrl: './book-list-page.html',
    styleUrl: './book-list-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListPage {
    public readonly booksService = inject(BookService);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private queryParamMap = toSignal(this.activatedRoute.queryParamMap);

    protected searchQuery = computed(() => {
        return this.queryParamMap()?.get('search') ?? '';
    });
    protected selectedStatus = computed(() => {
        return this.getInitialStatus(this.queryParamMap()?.get('status'));
    });
    protected sortField = computed(() => {
        return this.getInitialSortField(this.queryParamMap()?.get('sortField'));
    });
    protected sortOrder = computed(() => {
        return this.getInitialSortOrder(this.queryParamMap()?.get('sortOrder'));
    });
    protected page = computed(() => {
        return this.getInitialPage(Number(this.queryParamMap()?.get('page')));
    });
    protected limit = computed(() => {
        return this.getInitailLimit(Number(this.queryParamMap()?.get('limit')));
    });

    constructor() {
        effect(() => {
            this.booksService.loadBooks({
                page: this.page(),
                limit: this.limit(),
                sortField: this.sortField(),
                order: this.sortOrder(),
            })
        });
    }

    protected changeBookStatus(book: Book): void {
        this.booksService.changeBookStatus(book);
    }

    protected readonly isCreateBookModalOpen = signal<boolean>(false);

    protected openCreateBookModal(): void {
        this.isCreateBookModalOpen.set(true);
    }

    protected closeCreateBookModal(): void {
        this.isCreateBookModalOpen.set(false);
    }

    protected onSubmitBookModal(newBook: CreateBookDTO): void {
        this.booksService.addBook(newBook).subscribe({
            next: () => this.closeCreateBookModal(),
        });
    }

    protected deleteBook(book: Book): void {
        this.booksService.deleteBookById(book.id).subscribe();
    }

    protected handleBookClick(id: string): void {
        this.router.navigateByUrl(`/${String(id)}`);
    }

    private getInitialStatus(status?: string | null): BookFiltered {
        switch (status) {
            case 'in_wishlist':
            case 'reading':
            case 'finished':
                return status;
            default:
                return 'all';
        }
    }

    private getInitialSortField(sortField?: string | null): BookSortField {
        switch (sortField) {
            case BookSortField.Title:
            case BookSortField.CreatedAt:
                return sortField;
            default:
                return BookSortField.CreatedAt;
        }
    }

    private getInitialSortOrder(sortOrder?: string | null): SortOrder {
        switch (sortOrder) {
            case SortOrder.Asc:
            case SortOrder.Desc:
                return sortOrder;
            default:
                return SortOrder.Desc;
        }
    }
    private getInitialPage(page?: number | null): number {
        return Number.isFinite(page) && page ? page : 1;
    }
    private getInitailLimit(limit?: number | null): number {
        return Number.isFinite(limit) && limit ? limit : 10;
    }

    protected handleChangeSearch(search: string): void {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { search: search || null },
            queryParamsHandling: 'merge',
        });
    }

    protected handleChangeStatus(status: BookStatus): void {
        let newStatus = status as BookFiltered | undefined;
        if (status === this.selectedStatus()) {
            newStatus = undefined;
        }
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { status: newStatus },
            queryParamsHandling: 'merge',
        });
    }

    protected handleChangeSortField(sortField: BookSortField): void {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { sortField },
            queryParamsHandling: 'merge',
        });
    }

    protected handleChangeSortOrder(sortOrder: SortOrder): void {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { sortOrder },
            queryParamsHandling: 'merge',
        });
    }

    protected handleChangePage(page: number): void {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { page },
            queryParamsHandling: 'merge',
        });
    }

    protected handleChangeLimit(limit: number): void {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { limit },
            queryParamsHandling: 'merge',
        });
    }
}
