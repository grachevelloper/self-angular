import { Component, computed, effect, inject, signal } from '@angular/core';
import { Book, UpdateBookDTO } from '../../model';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services';
import { toSignal } from '@angular/core/rxjs-interop';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { BookRedactorComponent } from './components/book-redactor-component/book-redactor-component';

@Component({
    selector: 'app-book-details-page',
    imports: [NzButtonModule, NzIconModule, BookRedactorComponent],
    templateUrl: './book-details-page.html',
    styleUrl: './book-details-page.scss',
})
export class BookDetailsPage {

    constructor() {
        effect(() => {
            const book = this.book();
            if (book) {
                this.titleService.setTitle($localize`${book.title}:bookTitle: | Мои книги`);
                return;
            }
            this.titleService.setTitle($localize`Книга не найдена | Мои книги`);
        });
    }

    private router = inject(Router);
    private bookService = inject(BookService);
    private route = inject(ActivatedRoute);
    private data = toSignal(this.route.data)

    private titleService = inject(Title);

    protected readonly book = computed(() => {
        const resolvedBook = this.data()?.['book'] as Book | undefined;
        return this.bookService.currentBook() ?? resolvedBook;
    });
    protected readonly isLoading = this.bookService.loadingCurrentBook;
    protected readonly error = this.bookService.loadCurrentBookError;
    protected readonly updateError = this.bookService.updateError;
    protected readonly isBookRedactorOpen = signal(false);
    protected readonly isUpdatingBook = computed(() => {
        const book = this.book();
        return book ? this.bookService.updatingBookIds().has(book.id) : false;
    });

    protected handleBackClick() {
        this.router.navigate(['..'], { relativeTo: this.route });
    }

    protected openBookRedactor(): void {
        this.isBookRedactorOpen.set(true);
    }

    protected closeBookRedactor(): void {
        this.isBookRedactorOpen.set(false);
    }

    protected updateBook(updates: UpdateBookDTO): void {
        const book = this.book();
        if (!book) {
            return;
        }

        this.bookService.updateBookById(book.id, updates).subscribe({
            next: () => this.closeBookRedactor(),
        });
    }
}
