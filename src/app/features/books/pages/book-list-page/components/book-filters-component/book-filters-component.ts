import { Component, DestroyRef, effect, inject, input, output } from '@angular/core';
import { BookStatus } from '../../../../model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';

@Component({
    selector: 'app-book-filters',
    templateUrl: './book-filters-component.html',
    styleUrl: './book-filters-component.scss',
    imports: [ReactiveFormsModule]
})
export class BookFiltersComponent {
    public readonly selectedStatus = input.required<BookStatus | 'all'>();
    public readonly searchQuery = input.required<string>();

    private readonly destroyRef = inject(DestroyRef);

    protected readonly searchControl = new FormControl('', { nonNullable: true });

    public readonly statusSelected = output<BookStatus>();
    public readonly searchChanged = output<string>();

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
}
