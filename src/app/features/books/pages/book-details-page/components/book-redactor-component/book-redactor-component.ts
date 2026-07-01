import { Component, effect, Input, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { BookStatus, CreateBookDTO, UpdateBookDTO } from '../../../../model';

const VOID_STATE: CreateBookDTO = {
    title: '',
    author: '',
    status: 'in_wishlist',
    publishedAt: new Date(Date.now()),
}

@Component({
    selector: 'book-redactor-component',
    imports: [NzModalModule, ReactiveFormsModule],
    templateUrl: './book-redactor-component.html',
    styleUrl: './book-redactor-component.scss',
})
export class BookRedactorComponent implements OnChanges {
    @Input({ required: true }) titleIn!: string
    @Input({ required: true }) authorIn!: string
    @Input({ required: true }) statusIn!: BookStatus;
    @Input({ required: true }) publishedAtIn!: Date;

    public readonly isOpen = input.required<boolean>();
    public readonly isSubmitting = input(false);
    public readonly close = output<void>();
    public readonly submitUpdate = output<UpdateBookDTO>();



    protected bookForm = new FormGroup({
        title: new FormControl(VOID_STATE.title, {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(300)
            ]
        }),
        author: new FormControl(VOID_STATE.author, {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(150)
            ]
        }),
        status: new FormControl<BookStatus>(VOID_STATE.status, {
            nonNullable: true,
            validators: [Validators.required],
        }),

        publishedAt: new FormControl<Date>(VOID_STATE.publishedAt, {
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

    get title() { return this.bookForm.get('title'); }
    get author() { return this.bookForm.get('author'); }
    get status() { return this.bookForm.get('status'); }
    get publishedAt() { return this.bookForm.get('publishedAt'); }

    public ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['titleIn'] ||
            changes['authorIn'] ||
            changes['statusIn'] ||
            changes['publishedAtIn']
        ) {
            this.bookForm.setValue(this.getFormValueFromInputs());
        }
    }

    public onSubmit(): void {
        const form = this.bookForm;
        if (this.isSubmitting()) {
            return;
        }

        if (form.valid) {
            const formData = form.getRawValue() as UpdateBookDTO;
            this.submitUpdate.emit(formData)
        } else {
            this.bookForm.markAllAsTouched();
        }
    }

    protected onClose() {
        if (this.isSubmitting()) {
            return;
        }

        this.close.emit();
        this.bookForm.setValue(this.getFormValueFromInputs());
    }

    private getFormValueFromInputs(): CreateBookDTO {
        return {
            title: this.titleIn ?? VOID_STATE.title,
            author: this.authorIn ?? VOID_STATE.author,
            status: this.statusIn ?? VOID_STATE.status,
            publishedAt: this.publishedAtIn ?? VOID_STATE.publishedAt,
        };
    }
}
