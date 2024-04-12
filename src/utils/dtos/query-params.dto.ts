export class FilterCriteria {
  field: string;
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'contains';
  value: string | number;
}

export class QueryParams {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: FilterCriteria[];
  search?: string;
  searchFields?: string[];
  selectFields?: string[];
}
