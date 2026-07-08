import { Component, computed, input, output } from '@angular/core';

import { BookCardComponent } from '../book-card-component/book-card-component';
import { BookCardSkeletonComponent } from '../book-card-skeleton-component/book-card-skeleton-component';
import { SortOrder } from '../../../../../../shared/types';
import { Book, BookFiltered, BookSortField } from '../../../../model';

import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
    selector: 'book-list',
    imports: [
        BookCardComponent,
        BookCardSkeletonComponent,
        NzAlertModule,
        NzEmptyModule,
        NzGridModule,
        NzPaginationModule,
    ],
    templateUrl: './book-list-component.html',
    styleUrl: './book-list-component.scss',
})
export class BookListComponent {
    [x: string]: any;

    readonly books = input<Book[]>([]);
    readonly searchQuery = input<string>('');
    readonly selectedStatus = input.required<BookFiltered>();
    readonly sortField = input.required<BookSortField>();
    readonly sortOrder = input.required<SortOrder>();
    readonly page = input.required<number>();
    readonly limit = input.required<number>();
    readonly total = input(0);
    readonly isLoading = input(false);
    readonly loadError = input<string | null>(null);
    readonly updatingBookIds = input<ReadonlySet<string>>(new Set<string>());
    readonly deletingBookIds = input<ReadonlySet<string>>(new Set<string>());

    readonly clicked = output<string>();
    readonly statusClicked = output<Book>();
    readonly deleteClicked = output<Book>();
    readonly paginationLimitSelected = output<number>();
    readonly paginationPageSelected = output<number>();

    protected readonly skeletonBooks = computed(() => Array.from({ length: this.limit() }));

    protected readonly filteredBooks = computed(() => {
        let filteredBooks = [...this.books()];

        const query = this.searchQuery().trim().toLowerCase();
        const status = this.selectedStatus();
        const sortField = this.sortField();
        const sortOrder = this.sortOrder();

        if (query) {
            filteredBooks = filteredBooks.filter((book: Book) => {
                return (
                    book.author.toLowerCase().includes(query) ||
                    book.title.toLowerCase().includes(query)
                );
            });
        }
        if (status !== 'all') {
            filteredBooks = filteredBooks.filter((book: Book) => book.status === status);
        }

        filteredBooks.sort((a, b) => {
            const direction = sortOrder === SortOrder.Asc ? 1 : -1;

            switch (sortField) {
                case BookSortField.CreatedAt:
                    return (
                        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
                        direction
                    );
                case BookSortField.Title:
                    return a.title.localeCompare(b.title) * direction;
            }
        });

        return filteredBooks;
    });
}
