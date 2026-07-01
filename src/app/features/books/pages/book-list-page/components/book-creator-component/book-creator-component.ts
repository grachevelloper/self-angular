import { Component, effect, input, output } from '@angular/core';
import { CreateBookDTO, type BookStatus } from '../../../../model';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

const VOID_STATE: CreateBookDTO = {
    title: '',
    author: '',
    status: 'in_wishlist',
    publishedAt: new Date(Date.now()),
}


@Component({
    selector: 'app-book-creator-component',
    templateUrl: './book-creator-component.html',
    styleUrl: './book-creator-component.scss',
    imports: [ReactiveFormsModule],
})
export class BookCreatorComponent {
    public readonly isOpen = input.required<boolean>();
    public readonly isSubmitting = input(false);
    public readonly close = output<void>();
    public readonly submitBook = output<CreateBookDTO>();

    protected bookForm = new FormGroup({
        title: new FormControl({ value: '', disabled: false }, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(300)
        ]),
        author: new FormControl({ value: '', disabled: false }, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(150)
        ]),
        status: new FormControl<BookStatus>({ value: 'in_wishlist', disabled: false }, [
            Validators.required,
        ]),
        publishedAt: new FormControl<Date>({ value: new Date(), disabled: false }, [
            Validators.required,
        ])
    })


    private readonly toggleFormDisabled = effect(() => {
        if (this.isSubmitting()) {
            this.bookForm.disable();
        } else {
            this.bookForm.enable();
        }
    });


    get title() { return this.bookForm.get('title'); }
    get author() { return this.bookForm.get('author'); }
    get status() { return this.bookForm.get('status'); }
    get publishedAt() { return this.bookForm.get('publishedAt'); }

    public onSubmit(): void {
        const form = this.bookForm;
        if (this.isSubmitting()) {
            return;
        }

        if (form.valid) {
            const formData = form.getRawValue() as CreateBookDTO;
            this.submitBook.emit(formData)
        } else {
            this.bookForm.markAllAsTouched();
        }
    }

    protected onClose() {
        if (this.isSubmitting()) {
            return;
        }

        this.close.emit();
        this.bookForm.setValue(VOID_STATE);
    }
}
