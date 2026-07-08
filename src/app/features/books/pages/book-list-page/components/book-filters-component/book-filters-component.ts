import { Component, DestroyRef, effect, inject, input, output } from '@angular/core';
import { BookFiltered, BookSortField, BookStatus } from '../../../../model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SortOrder } from '../../../../../../shared/types';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
    selector: 'book-filters',
    templateUrl: './book-filters-component.html',
    styleUrl: './book-filters-component.scss',
    imports: [FormsModule, ReactiveFormsModule, NzButtonModule, NzSelectModule],
})
export class BookFiltersComponent {
    protected readonly BookSortField = BookSortField;
    protected readonly SortOrder = SortOrder;

    public readonly selectedStatus = input.required<BookFiltered>();
    public readonly searchQuery = input.required<string>();
    public readonly sortField = input.required<BookSortField>();
    public readonly sortOrder = input.required<SortOrder>();

    private readonly destroyRef = inject(DestroyRef);

    protected readonly searchControl = new FormControl('', { nonNullable: true });

    public readonly statusSelected = output<BookStatus>();
    public readonly searchChanged = output<string>();
    public readonly sortFieldChanged = output<BookSortField>();
    public readonly sortOrderChanged = output<SortOrder>();

    constructor() {
        effect(() => {
            const query = this.searchQuery();

            if (query !== this.searchControl.value) {
                this.searchControl.setValue(query, { emitEvent: false });
            }
        });

        this.searchControl.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe((query) => {
                this.searchChanged.emit(query);
            });
    }

    public onStatusSelected(status: BookStatus): void {
        this.statusSelected.emit(status);
    }

    public onSortFieldSelected(field: BookSortField): void {
        this.sortFieldChanged.emit(field);
    }

    public onSortOrderSelected(order: SortOrder): void {
        this.sortOrderChanged.emit(order);
    }
}
