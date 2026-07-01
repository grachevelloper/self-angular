import { Component, input, output } from '@angular/core';
import { Book } from '../../../../model';

@Component({
    selector: 'app-book-card',
    templateUrl: './book-card-component.html',
    styleUrl: './book-card-component.scss',
})
export class BookCardComponent {
    public readonly book = input.required<Book>();
    public readonly isUpdating = input(false);
    public readonly isDeleting = input(false);

    public clicked = output<void>();
    public statusClicked = output<Book>();
    public deleteClicked = output<Book>();
}
