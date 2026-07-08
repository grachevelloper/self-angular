import { SortOrder } from '.'

export type PaginatedQuery<T> = {
    sortField: T
    order: SortOrder
    page: number
    limit: number
}
