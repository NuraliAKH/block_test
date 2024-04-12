import { FilterCriteria, QueryParams } from '../dtos/query-params.dto';

export class QueryParamsParser {
  private static initializeParams(queryParams: QueryParams) {
    return {
      take: queryParams.limit || 10,
      skip: ((queryParams.page || 1) - 1) * (queryParams.limit || 10),
      orderBy: queryParams.sortBy
        ? { [queryParams.sortBy]: queryParams.sortOrder || 'asc' }
        : {},
      where: {},
      select: queryParams.selectFields?.reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {},
      ),
    };
  }

  private static addFilterConditions(params: any, filters?: FilterCriteria[]) {
    const conditionMap = {
      gt: 'gt',
      lt: 'lt',
      gte: 'gte',
      lte: 'lte',
      eq: 'equals',
      contains: 'contains',
    };

    filters?.forEach(({ field, operator, value }) => {
      if (!params.where[field]) params.where[field] = {};
      params.where[field][conditionMap[operator]] = value;
    });
  }

  private static addSearchConditions(
    params: any,
    search?: string,
    searchFields?: string[],
  ) {
    if (search && searchFields?.length > 0) {
      params.where = {
        AND: searchFields.map((field) => ({ [field]: { contains: search } })),
      };
    }
  }

  public static parse(queryParams: QueryParams) {
    const params = this.initializeParams(queryParams);
    this.addFilterConditions(params, queryParams.filters);
    this.addSearchConditions(
      params,
      queryParams.search,
      queryParams.searchFields,
    );
    return params;
  }
}
