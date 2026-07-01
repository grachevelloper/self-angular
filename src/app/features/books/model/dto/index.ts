import { BookStatus } from '..';

export interface UpdateBookDTO extends Partial<CreateBookDTO> { }

export interface CreateBookDTO {
    title: string;
    author: string;
    status: BookStatus;
    publishedAt: Date;
}
