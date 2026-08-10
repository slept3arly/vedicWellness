export const MAX_PAGE_NUMBER = 1000;
export const MAX_PAGE_SIZE = 25;

export function normalizePagination(
  page: number,
  limit: number,
  defaultLimit: number
) {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : defaultLimit;

  return {
    page: Math.min(safePage, MAX_PAGE_NUMBER),
    limit: Math.min(safeLimit, MAX_PAGE_SIZE),
  };
}
