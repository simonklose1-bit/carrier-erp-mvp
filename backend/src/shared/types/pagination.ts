export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function paginate(query: PaginationQuery): { skip: number; take: number } {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, query.limit ?? 20);
  return { skip: (page - 1) * limit, take: limit };
}
