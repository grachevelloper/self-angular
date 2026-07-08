export enum SortOrder {
    Desc = 'desc',
    Asc = 'asc',
}

export type PaginatedResponse<T> = {
    items: T[]
    page: number
    total: number
    limit: number
    has_next: boolean
}
