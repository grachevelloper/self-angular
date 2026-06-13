import { Component, input, output } from '@angular/core';
import { BookStatus } from '../../model';

@Component({
    selector: 'app-book-filters',
    templateUrl: './book-filters-component.html',
    styleUrl: './book-filters-component.scss',
})
export class BookFiltersComponent {
    public readonly selectedStatus = input.required<BookStatus | 'all'>();
    public readonly searchQuery = input.required<string>();

    public readonly statusSelected = output<BookStatus>();
    public readonly searchChanged = output<string>();

}
