import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { CreateBookDTO, type BookStatus } from '../../../../model';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';

interface BookCreatorFormValue {
    title: string;
    author: string;
    status: BookStatus;
    publishedAt: string;
}

function createEmptyFormValue(): BookCreatorFormValue {
    return {
        title: '',
        author: '',
        status: 'in_wishlist',
        publishedAt: new Date().toISOString().slice(0, 10),
    };
}


@Component({
    selector: 'app-book-creator-component',
    templateUrl: './book-creator-component.html',
    styleUrl: './book-creator-component.scss',
    imports: [NzModalModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreatorComponent {
    public readonly isOpen = input.required<boolean>();
    public readonly isSubmitting = input(false);
    public readonly close = output<void>();
    public readonly submitBook = output<CreateBookDTO>();

    protected readonly bookForm = new FormGroup({
        title: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(300)
            ]
        }),
        author: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(150)
            ]
        }),
        status: new FormControl<BookStatus>('in_wishlist', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        publishedAt: new FormControl(createEmptyFormValue().publishedAt, {
            nonNullable: true,
            validators: [Validators.required],
        })
    })


    private readonly toggleFormDisabled = effect(() => {
        if (this.isSubmitting()) {
            this.bookForm.disable();
        } else {
            this.bookForm.enable();
        }
    });

    private readonly resetFormOnClose = effect(() => {
        if (!this.isOpen() && !this.isSubmitting()) {
            this.resetForm();
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
            const formData = form.getRawValue();
            this.submitBook.emit({
                ...formData,
                publishedAt: new Date(formData.publishedAt),
            })
        } else {
            this.bookForm.markAllAsTouched();
        }
    }

    protected onClose() {
        if (this.isSubmitting()) {
            return;
        }

        this.close.emit();
        this.resetForm();
    }

    private resetForm(): void {
        this.bookForm.reset(createEmptyFormValue());
    }
}
