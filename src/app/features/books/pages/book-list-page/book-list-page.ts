import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { BookStatus, Book, BookFiltered, CreateBookDTO } from '../../model';
import { BookService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BookCreatorComponent } from './components/book-creator-component/book-creator-component';
import { BookFiltersComponent } from './components/book-filters-component/book-filters-component';
import { Sorted } from '../../../../shared/types';
import { BookListComponent } from './components/book-list-component/book-list-component';

@Component({
    selector: 'book-list-page',
    imports: [BookFiltersComponent, BookCreatorComponent, BookListComponent],
    templateUrl: './book-list-page.html',
    styleUrl: './book-list-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListPage {
    public readonly booksService = inject(BookService)
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private queryParamMap = toSignal(this.activatedRoute.queryParamMap);

    protected searchQuery = computed(() => {
        return this.queryParamMap()?.get('search') ?? '';
    });
    protected selectedStatus = computed(() => {
        return this.getInitialStatus(this.queryParamMap()?.get('status'));
    });
    protected sortOrder = computed(() => {
        return this.getInitialSortOrder(this.queryParamMap()?.get('sorted'));
    });

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
        this.router.navigateByUrl(`/${String(id)}`)
    }


    private getInitialStatus(status?: string | null): BookFiltered {
        switch (status) {
            case 'in_wishlist':
            case 'reading':
            case 'finished':
                return status;
            default:
                return 'all'
        }
    }

    private getInitialSortOrder(sortOrder?: string | null): Sorted {
        switch (sortOrder) {
            case Sorted.CreatedAsc:
            case Sorted.CreatedDesc:
            case Sorted.TitleAsc:
            case Sorted.TitleDesc:
                return sortOrder;
            default:
                return Sorted.CreatedDesc;
        }
    }

    protected handleChangeSearch(search: string): void {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { search: search || null },
            queryParamsHandling: 'merge'
        })
    }

    protected handleChangeStatus(status: BookStatus): void {
        let newStatus = status as BookFiltered | undefined;
        if (status === this.selectedStatus()) {
            newStatus = undefined
        }
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { status: newStatus },
            queryParamsHandling: 'merge'
        })
    }

    protected handleChangeSortOrder(sortOrder: Sorted): void {
        let newSortOrder = sortOrder as Sorted | undefined;
        if (newSortOrder === this.sortOrder()) {
            newSortOrder = undefined
        }
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { sorted: newSortOrder },
            queryParamsHandling: 'merge'
        })
    }

}
