import { Component, computed, effect, inject } from '@angular/core';
import { Book } from '../../model';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-book-details-page',
    imports: [],
    templateUrl: './book-details-page.html',
    styleUrl: './book-details-page.scss',
})
export class BookDetailsPage {

    constructor() {
        effect(() => {
            const book = this.book();
            if (book) {
                this.titleService.setTitle(`${book.title} | Мои книги`);
                return;
            }
            this.titleService.setTitle('Книга не найдена | Мои книги');
        });
    }

    private router = inject(Router);
    private bookService = inject(BookService);
    private route = inject(ActivatedRoute);
    private data = toSignal(this.route.data)

    private titleService = inject(Title);

    protected readonly book = computed(() => this.data()?.['book'] as Book | undefined);
    protected readonly isLoading = this.bookService.loadingCurrentBook;
    protected readonly error = this.bookService.loadCurrentBookError;

    protected handleBackClick() {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}
