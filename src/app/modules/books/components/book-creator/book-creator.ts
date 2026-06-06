import { Component, input, output, signal } from '@angular/core';
import { Book } from '../../model';


export interface CreateBookDTO extends Omit<Book, 'id'> {}
export interface UpdateBookDTO extends Partial<CreateBookDTO> {}

const VOID_STATE: CreateBookDTO = {
  title: '',
  author: '',
  status: 'wishlist'
}


@Component({
  selector: 'app-book-creator',
  templateUrl: './book-creator.html',
  styleUrl: './book-creator.scss',
  imports: [],
})
export class BookCreator {
  public readonly isOpen = input.required<boolean>();
  public readonly close = output<void>();
  public readonly submitBook = output<CreateBookDTO>();

  public readonly state = signal<CreateBookDTO | undefined>(VOID_STATE);

  public onSubmit(): void {
    const book = this.state();
    if (book?.title && book?.author) {
      this.submitBook.emit(book);
    }
  }

   protected onClose() {
    this.close.emit();
    this.state.set(VOID_STATE);
  }



  protected changeState(
    updates: UpdateBookDTO
  ): void {
    this.state.update(currentState => {
      if (!currentState) {
        return { ...updates } as CreateBookDTO;
      }

      return {
        ...currentState,
        ...updates
      }
    })
  }

}
