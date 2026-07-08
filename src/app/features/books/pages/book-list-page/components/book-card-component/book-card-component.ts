import { Component, input, output } from '@angular/core';
import { Book, BookStatus } from '../../../../model';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
    selector: 'app-book-card',
    imports: [NzButtonModule, NzCardModule, NzTagModule, NzTypographyModule],
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

    protected statusLabel(status: BookStatus): string {
        switch (status) {
            case 'reading':
                return 'Читаю';
            case 'finished':
                return 'Прочитано';
            case 'in_wishlist':
                return 'В планах';
        }
    }

    protected statusColor(status: BookStatus): string {
        switch (status) {
            case 'reading':
                return 'processing';
            case 'finished':
                return 'success';
            case 'in_wishlist':
                return 'default';
        }
    }
}
