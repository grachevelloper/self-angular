import { Component, DestroyRef, effect, inject, input, output } from '@angular/core';
import { BookFiltered, BookStatus } from '../../../../model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Sorted } from '../../../../../../shared/types';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
    selector: 'book-filters',
    templateUrl: './book-filters-component.html',
    styleUrl: './book-filters-component.scss',
    imports: [FormsModule, ReactiveFormsModule, NzButtonModule, NzSelectModule]
})
export class BookFiltersComponent {
    protected readonly Sorted = Sorted;

    public readonly selectedStatus = input.required<BookFiltered>();
    public readonly searchQuery = input.required<string>();
    public readonly sorted = input.required<Sorted>();

    private readonly destroyRef = inject(DestroyRef);

    protected readonly searchControl = new FormControl('', { nonNullable: true });

    public readonly statusSelected = output<BookStatus>();
    public readonly searchChanged = output<string>();
    public readonly sortedChanged = output<Sorted>();

    constructor() {
        effect(() => {
            const query = this.searchQuery();

            if (query !== this.searchControl.value) {
                this.searchControl.setValue(query, { emitEvent: false });
            }
        });

        this.searchControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((query) => {
                this.searchChanged.emit(query);
            });
    }

    public onStatusSelected(status: BookStatus): void {
        this.statusSelected.emit(status);
    }
    public onSortOrderSelected(order: Sorted): void {
        this.sortedChanged.emit(order);
    }
}
