export const ROUTES = {
  home: '/',
  judgments: '/judgments',
  judgmentDetail: '/judgments/:id',
  cases: '/cases',
  caseCreate: '/cases/new',
  caseDetail: '/cases/:id',
  legacyUpload: '/upload',
  profile: '/me',
  faq: '/faq',
  about: '/about',
} as const;

export const SEARCH_PARAMS = {
  keyword: 'keyword',
  page: 'page',
  city: 'city',
  district: 'district',
} as const;

const withQuery = (path: string, params: Record<string, string | number | undefined>): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') {
      return;
    }
    query.set(key, String(value));
  });
  const search = query.toString();
  return search ? `${path}?${search}` : path;
};

const FIRST_PAGE = 1;

export const buildJudgmentSearchPath = (keyword: string, page?: number): string =>
  withQuery(ROUTES.judgments, {
    [SEARCH_PARAMS.keyword]: keyword.trim(),
    [SEARCH_PARAMS.page]: page && page > FIRST_PAGE ? page : undefined,
  });

export const buildJudgmentDetailPath = (id: string, keyword?: string): string =>
  withQuery(`${ROUTES.judgments}/${encodeURIComponent(id)}`, { [SEARCH_PARAMS.keyword]: keyword?.trim() });

export const buildCaseListPath = (params: { city?: string; district?: string; keyword?: string } = {}): string =>
  withQuery(ROUTES.cases, {
    [SEARCH_PARAMS.city]: params.city,
    [SEARCH_PARAMS.district]: params.district,
    [SEARCH_PARAMS.keyword]: params.keyword?.trim(),
  });

export const buildCaseDetailPath = (id: number): string => `${ROUTES.cases}/${id}`;
