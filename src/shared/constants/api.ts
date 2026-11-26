export const API_PATHS = {
  authVerify: '/auth/verify',
  authRegister: '/auth/register',
  authLogin: '/auth/login',
  usersMe: '/users/me',
  judgments: '/judgments',
  judgmentDetail: '/judgments/detail',
  warningNames: '/judgments/warning_names',
  cityStats: '/judgments/city_stats',
  judgmentComments: '/judgment_comments',
  judgmentLikes: '/judgment_likes',
  judgmentLikesToggle: '/judgment_likes/toggle',
  cases: '/cases',
  casesSearch: '/cases/search',
  caseDetail: '/cases/detail',
  caseComments: '/case_comments',
  caseLikes: '/case_likes',
  caseLikesToggle: '/case_likes/toggle',
  stats: '/stats',
} as const;

export const API_CODES = {
  success: 20000,
  notFound: 20400,
  validation: 40000,
  unauthorized: 40100,
  invalidCredentials: 40101,
  invalidFirebaseToken: 40102,
  conflict: 40900,
  tooManyRequests: 42900,
  serverError: 50000,
  /** 前端自訂：連線失敗（無 HTTP 回應）。 */
  network: -1,
} as const;

export type ApiCode = (typeof API_CODES)[keyof typeof API_CODES];

export const HTTP_STATUS = {
  ok: 200,
  created: 201,
  unauthorized: 401,
  tooManyRequests: 429,
  serverError: 500,
} as const;

export const PAGE_LIMIT = {
  default: 10,
  max: 50,
} as const;

export const REQUEST_TIMEOUT_MS = 20_000;
