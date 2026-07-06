import { Component, computed, input, output } from '@angular/core';

import { BookCardComponent } from '../book-card-component/book-card-component';
import { Sorted } from '../../../../../../shared/types';
import { Book, BookFiltered } from '../../../../model';

@Component({
    selector: 'book-list',
    imports: [BookCardComponent],
    templateUrl: './book-list-component.html',
    styleUrl: './book-list-component.scss',
})
export class BookListComponent {

    readonly books = input<Book[]>([])
    readonly searchQuery = input<string>('');
    readonly selectedStatus = input.required<BookFiltered>();
    readonly sortOrder = input.required<Sorted>();
    readonly isLoading = input(false);
    readonly loadError = input<string | null>(null);
    readonly updatingBookIds = input<ReadonlySet<string>>(new Set<string>());
    readonly deletingBookIds = input<ReadonlySet<string>>(new Set<string>());

    readonly clicked = output<string>();
    readonly statusClicked = output<Book>();
    readonly deleteClicked = output<Book>();

    protected readonly filteredBooks = computed(() => {
        let filteredBooks = [...this.books()];

        const query = this.searchQuery().trim().toLowerCase();
        const status = this.selectedStatus()
        const sortOrder = this.sortOrder()

        if (query) {
            filteredBooks = filteredBooks.filter((book: Book) => {
                return book.author.toLowerCase().includes(query) ||
                    book.title.toLowerCase().includes(query)
            });
        }

        filteredBooks.sort((a, b) => {
            switch (sortOrder) {
                case Sorted.CreatedAsc:
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

                case Sorted.CreatedDesc:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

                case Sorted.TitleAsc:
                    return a.title.localeCompare(b.title);

                case Sorted.TitleDesc:
                    return b.title.localeCompare(a.title);

            }
        });

        if (status === 'all') {
            return filteredBooks;
        }

        return filteredBooks.filter((book: Book) => book.status === status);
    });



}
