import { delay, http, type HttpHandler } from 'msw';
import { DISPLAY_NAME_MAX_LENGTH, MOCK_FIREBASE_TOKEN_PREFIX, NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/features/auth/constants';
import { CASE_LIMITS, IMAGE_LIMITS } from '@/features/cases/constants';
import { COMMENT_MAX_LENGTH } from '@/features/engagement/types';
import type { AuthResult, CaseListItem, Comment, JudgmentDetail, JudgmentListItem, LikeState, UserProfile } from '@/shared/api/types';
import { API_CODES, API_PATHS, HTTP_STATUS } from '@/shared/constants/api';
import { API_BASE_URL } from '@/shared/constants/env';
import { isDistrictOfCity, isTaiwanCity } from '@/shared/constants/taiwan-districts';
import { toJudgmentCity } from '@/shared/utils/city-name';
import { createMockDb, type MockDb } from './db';
import type { CaseRecord } from './fixtures/cases';
import { commentTargetKey } from './fixtures/comments';
import type { JudgmentRecord } from './fixtures/judgments';
import type { UserRecord } from './fixtures/users';
import { fail, maskHalf, maskIp, normalizePhone, notFound, ok, paginate, parsePageQuery, unauthorized, validationError } from './utils';

/**
 * MSW handlers：完全依照 docs/api-v1.md 合約回應（成功 `{status, code, data}`、失敗 `{status, code, error}`）。
 */

export const MOCK_ACCESS_TOKEN_PREFIX = 'mock-access-token.';

const BEARER_PREFIX = 'Bearer ';
const TOKEN_VERSION_SEPARATOR = '.';
const INITIAL_TOKEN_VERSION = 0;
const ANONYMOUS_NAME_MARK = '○';
const WARNING_NAME_MAX_LENGTH = 12;
const WARNING_LIST_MAX = 100;
const WARNING_DEFAULT_RENT_MAX = 1_000_000;
const WARNING_DEFAULT_MIN_COUNT = 2;
const MOCK_IP = '203.69.88.120';

const url = (path: string) => `${API_BASE_URL}${path}`;

/**
 * Mock token：`mock-access-token.<手機>[.<版本>]`。版本 0 省略，與舊格式相容。
 * 改密碼會遞增使用者的 token 版本，版本較舊的 token 回 HTTP 401（模擬後端撤銷舊 token）。
 */
export const createMockAccessToken = (phone: string, version: number = INITIAL_TOKEN_VERSION): string => {
  const base = `${MOCK_ACCESS_TOKEN_PREFIX}${encodeURIComponent(phone)}`;
  return version === INITIAL_TOKEN_VERSION ? base : `${base}${TOKEN_VERSION_SEPARATOR}${version}`;
};

const parseMockAccessToken = (token: string): { phone: string; version: number } | null => {
  if (!token.startsWith(MOCK_ACCESS_TOKEN_PREFIX)) {
    return null;
  }
  const [encodedPhone, versionText] = token.slice(MOCK_ACCESS_TOKEN_PREFIX.length).split(TOKEN_VERSION_SEPARATOR);
  const version = versionText === undefined ? INITIAL_TOKEN_VERSION : Number(versionText);
  if (!encodedPhone || !Number.isInteger(version)) {
    return null;
  }
  return { phone: decodeURIComponent(encodedPhone), version };
};

const issueToken = (user: UserRecord) => createMockAccessToken(user.phone, user.tokenVersion);

const toProfile = (user: UserRecord): UserProfile => ({
  uid: user.uid,
  phone: user.phone,
  name: user.name,
  displayName: user.displayName,
  email: user.email,
  hasPassword: Boolean(user.password),
});

const toAuthResult = (user: UserRecord): AuthResult => ({ user: toProfile(user), accessToken: issueToken(user) });

const findOrCreateUser = (db: MockDb, phone: string): UserRecord => {
  const existing = db.users.find((user) => user.phone === phone);
  if (existing) {
    return existing;
  }
  const created: UserRecord = { uid: `mock-uid-${db.users.length + 1}`, phone, displayName: `會員${phone.slice(-3)}` };
  db.users.push(created);
  return created;
};

/** Mock token 內含手機號碼，重新整理頁面（db 重置）後仍可維持登入；版本比使用者目前版本舊的 token 視為已撤銷。 */
const getCurrentUser = (db: MockDb, request: Request): UserRecord | null => {
  const header = request.headers.get('Authorization');
  if (!header?.startsWith(BEARER_PREFIX)) {
    return null;
  }
  const parsed = parseMockAccessToken(header.slice(BEARER_PREFIX.length));
  if (!parsed) {
    return null;
  }
  const user = findOrCreateUser(db, parsed.phone);
  return parsed.version < (user.tokenVersion ?? INITIAL_TOKEN_VERSION) ? null : user;
};

const parseFirebaseToken = (token: unknown): string | null => {
  if (typeof token !== 'string' || !token.startsWith(MOCK_FIREBASE_TOKEN_PREFIX)) {
    return null;
  }
  return normalizePhone(token.slice(MOCK_FIREBASE_TOKEN_PREFIX.length));
};

const likesOf = (db: MockDb, key: string): Set<string> => {
  const existing = db.likes.get(key);
  if (existing) {
    return existing;
  }
  const created = new Set<string>();
  db.likes.set(key, created);
  return created;
};

const likeState = (db: MockDb, key: string, baseCount: number, user: UserRecord | null): LikeState => {
  const set = likesOf(db, key);
  return { likeCount: baseCount + set.size, liked: user ? set.has(user.uid) : false };
};

const commentCount = (db: MockDb, key: string) => db.comments.filter((comment) => comment.targetKey === key).length;

const toJudgmentItem = (db: MockDb, record: JudgmentRecord): JudgmentListItem => {
  const key = commentTargetKey('judgment', record.id);
  return {
    id: record.id,
    jyear: record.jyear,
    jcase: record.jcase,
    jno: record.jno,
    jdate: record.jdate,
    jtitle: record.jtitle,
    plaintiff: record.plaintiff,
    defendant: record.defendant,
    rent: record.rent,
    city: record.city,
    district: record.district,
    win: record.win,
    likeCount: record.baseLikeCount + likesOf(db, key).size,
    commentCount: commentCount(db, key),
  };
};

const toJudgmentDetail = (db: MockDb, record: JudgmentRecord): JudgmentDetail => ({ ...toJudgmentItem(db, record), jfull: record.jfull, jpdf: record.jpdf });

const toCaseItem = (db: MockDb, record: CaseRecord): CaseListItem => {
  const key = commentTargetKey('case', record.id);
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    location: record.location,
    district: record.district,
    rent: record.rent,
    defendantName: maskHalf(record.defendantName),
    defendantPhone: maskHalf(record.defendantPhone),
    defendantIdNo: maskHalf(record.defendantIdNo),
    imageUrls: record.imageUrls,
    authorDisplayName: record.authorDisplayName,
    likeCount: record.baseLikeCount + likesOf(db, key).size,
    commentCount: commentCount(db, key),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

const sortCasesNewestFirst = (a: CaseRecord, b: CaseRecord) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id;

const toComment = (record: { id: number; content: string; authorDisplayName?: string; ip: string; createdAt: string }): Comment => ({
  id: record.id,
  content: record.content,
  authorDisplayName: record.authorDisplayName,
  ipMasked: maskIp(record.ip),
  createdAt: record.createdAt,
});

const sameName = (a: string | undefined, keyword: string) => Boolean(a && a.toLowerCase() === keyword.toLowerCase());

const readJson = async (request: Request): Promise<Record<string, unknown>> => {
  try {
    const body: unknown = await request.json();
    return typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
};

const isNonEmptyString = (value: unknown, max: number): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= max;

const blobUrl = (file: File): string => {
  try {
    return URL.createObjectURL(file);
  } catch {
    return '';
  }
};

interface HandlerOptions {
  db?: MockDb;
  /** 模擬網路延遲（瀏覽器 mock 模式使用；測試設 0） */
  latency?: boolean;
}

export const createHandlers = ({ db = createMockDb(), latency = false }: HandlerOptions = {}): HttpHandler[] => {
  const wait = async () => {
    if (latency) {
      await delay();
    }
  };

  const createComment = async (request: Request, kind: 'judgment' | 'case', idField: 'filesetId' | 'caseId') => {
    await wait();
    const user = getCurrentUser(db, request);
    if (!user) {
      return unauthorized();
    }
    const body = await readJson(request);
    const targetId = body[idField];
    if (targetId === undefined || targetId === '') {
      return validationError(`${idField} should not be empty`);
    }
    if (!isNonEmptyString(body.content, COMMENT_MAX_LENGTH)) {
      return validationError('content must be between 1 and 1000 characters');
    }
    const record = {
      id: db.nextCommentId(),
      targetKey: commentTargetKey(kind, String(targetId)),
      content: body.content.trim(),
      authorDisplayName: user.displayName,
      ip: MOCK_IP,
      createdAt: new Date().toISOString(),
    };
    db.comments.push(record);
    return ok(toComment(record), HTTP_STATUS.created);
  };

  const listComments = async (request: Request, kind: 'judgment' | 'case', idParam: string) => {
    await wait();
    const id = new URL(request.url).searchParams.get(idParam);
    if (!id) {
      return validationError(`${idParam} should not be empty`);
    }
    const key = commentTargetKey(kind, id);
    return ok({ list: db.comments.filter((comment) => comment.targetKey === key).map(toComment) });
  };

  const baseLikes = (kind: 'judgment' | 'case', id: string): number => {
    if (kind === 'judgment') {
      return db.judgments.find((item) => item.id === id)?.baseLikeCount ?? 0;
    }
    return db.cases.find((item) => String(item.id) === id)?.baseLikeCount ?? 0;
  };

  const getLikes = async (request: Request, kind: 'judgment' | 'case', idParam: string) => {
    await wait();
    const id = new URL(request.url).searchParams.get(idParam);
    if (!id) {
      return validationError(`${idParam} should not be empty`);
    }
    return ok(likeState(db, commentTargetKey(kind, id), baseLikes(kind, id), getCurrentUser(db, request)));
  };

  const toggleLike = async (request: Request, kind: 'judgment' | 'case', idField: string) => {
    await wait();
    const user = getCurrentUser(db, request);
    if (!user) {
      return unauthorized();
    }
    const body = await readJson(request);
    const id = body[idField];
    if (id === undefined || id === '') {
      return validationError(`${idField} should not be empty`);
    }
    const key = commentTargetKey(kind, String(id));
    const set = likesOf(db, key);
    if (set.has(user.uid)) {
      set.delete(user.uid);
    } else {
      set.add(user.uid);
    }
    return ok(likeState(db, key, baseLikes(kind, String(id)), user));
  };

  return [
    // ---------- Auth / Users ----------
    http.post(url(API_PATHS.authVerify), async ({ request }) => {
      await wait();
      const body = await readJson(request);
      const phone = parseFirebaseToken(body.firebaseToken);
      if (!phone) {
        return fail(API_CODES.invalidFirebaseToken, 'Invalid firebase token');
      }
      return ok(toAuthResult(findOrCreateUser(db, phone)));
    }),
    http.post(url(API_PATHS.authRegister), async ({ request }) => {
      await wait();
      const body = await readJson(request);
      const phone = parseFirebaseToken(body.firebaseToken);
      if (!phone) {
        return fail(API_CODES.invalidFirebaseToken, 'Invalid firebase token');
      }
      const { password, name, displayName, email } = body;
      if (typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
        return validationError('password must be between 8 and 64 characters');
      }
      if (
        !isNonEmptyString(name, NAME_MAX_LENGTH) ||
        !isNonEmptyString(displayName, DISPLAY_NAME_MAX_LENGTH) ||
        typeof email !== 'string' ||
        !email.includes('@')
      ) {
        return validationError('name, displayName and email are required');
      }
      const user = findOrCreateUser(db, phone);
      if (user.password) {
        return fail(API_CODES.conflict, 'Phone already registered');
      }
      Object.assign(user, { password, name, displayName, email });
      return ok(toAuthResult(user));
    }),
    http.post(url(API_PATHS.authLogin), async ({ request }) => {
      await wait();
      const body = await readJson(request);
      if (typeof body.phone !== 'string' || typeof body.password !== 'string') {
        return validationError('phone and password are required');
      }
      const phone = normalizePhone(body.phone);
      const user = db.users.find((item) => item.phone === phone);
      if (!user?.password || user.password !== body.password) {
        return fail(API_CODES.invalidCredentials, 'Invalid phone or password');
      }
      return ok(toAuthResult(user));
    }),
    http.get(url(API_PATHS.usersMe), async ({ request }) => {
      await wait();
      const user = getCurrentUser(db, request);
      return user ? ok(toProfile(user)) : unauthorized();
    }),
    http.patch(url(API_PATHS.usersMe), async ({ request }) => {
      await wait();
      const user = getCurrentUser(db, request);
      if (!user) {
        return unauthorized();
      }
      const { displayName, email, password, currentPassword } = await readJson(request);
      // 先驗證全部欄位，任何一項失敗都不寫入（與後端相同）
      if (displayName !== undefined && !isNonEmptyString(displayName, DISPLAY_NAME_MAX_LENGTH)) {
        return validationError('displayName must be between 1 and 30 characters');
      }
      if (email !== undefined && (typeof email !== 'string' || !email.includes('@'))) {
        return validationError('email must be an email');
      }
      if (password !== undefined && (typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH)) {
        return validationError('password must be between 8 and 64 characters');
      }
      if (currentPassword !== undefined && typeof currentPassword !== 'string') {
        return validationError('currentPassword must be a string');
      }
      if (typeof password === 'string' && user.password && currentPassword !== user.password) {
        return fail(API_CODES.invalidCredentials, 'current password is incorrect');
      }
      if (typeof displayName === 'string') {
        user.displayName = displayName;
      }
      if (typeof email === 'string') {
        user.email = email;
      }
      if (typeof password === 'string') {
        user.password = password;
        user.tokenVersion = (user.tokenVersion ?? INITIAL_TOKEN_VERSION) + 1;
      }
      return ok(toAuthResult(user));
    }),

    // ---------- Judgments ----------
    http.get(url(API_PATHS.judgments), async ({ request }) => {
      await wait();
      const requestUrl = new URL(request.url);
      const keyword = requestUrl.searchParams.get('keyword')?.trim();
      if (!keyword) {
        return validationError('keyword should not be empty');
      }
      const pageQuery = parsePageQuery(requestUrl);
      if (typeof pageQuery === 'string') {
        return validationError(pageQuery);
      }
      const matched = db.judgments
        .filter((item) => sameName(item.plaintiff, keyword) || sameName(item.defendant, keyword))
        .sort((a, b) => b.jdate.localeCompare(a.jdate))
        .map((item) => toJudgmentItem(db, item));
      return ok(paginate(matched, pageQuery));
    }),
    http.get(url(API_PATHS.judgmentDetail), async ({ request }) => {
      await wait();
      const id = new URL(request.url).searchParams.get('id');
      if (!id) {
        return validationError('id should not be empty');
      }
      const record = db.judgments.find((item) => item.id === id);
      return record ? ok(toJudgmentDetail(db, record)) : notFound();
    }),
    http.get(url(API_PATHS.warningNames), async ({ request }) => {
      await wait();
      const params = new URL(request.url).searchParams;
      const city = params.get('city');
      if (!city) {
        return validationError('city should not be empty');
      }
      const target = toJudgmentCity(city);
      const rentMin = Number(params.get('rentMin') ?? 0);
      const rentMax = Number(params.get('rentMax') ?? WARNING_DEFAULT_RENT_MAX);
      const minCount = Math.max(1, Number(params.get('minCount') ?? WARNING_DEFAULT_MIN_COUNT));
      const counts = new Map<string, number>();
      db.judgments
        .filter((item) => item.city === target && item.win && (item.rent ?? 0) >= rentMin && (item.rent ?? 0) <= rentMax)
        .forEach((item) => {
          const loser = item.win === 'plaintiff' ? item.defendant : item.plaintiff;
          if (!loser || loser.includes(ANONYMOUS_NAME_MARK) || loser.length > WARNING_NAME_MAX_LENGTH) {
            return;
          }
          counts.set(loser, (counts.get(loser) ?? 0) + 1);
        });
      const list = [...counts.entries()]
        .filter(([, count]) => count >= minCount)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, WARNING_LIST_MAX)
        .map(([name, judgmentCount]) => ({ name, judgmentCount }));
      return ok({ list });
    }),
    http.get(url(API_PATHS.cityStats), async () => {
      await wait();
      return ok({ list: db.cityStats });
    }),
    http.get(url(API_PATHS.judgmentComments), ({ request }) => listComments(request, 'judgment', 'filesetId')),
    http.post(url(API_PATHS.judgmentComments), ({ request }) => createComment(request, 'judgment', 'filesetId')),
    http.get(url(API_PATHS.judgmentLikes), ({ request }) => getLikes(request, 'judgment', 'filesetId')),
    http.post(url(API_PATHS.judgmentLikesToggle), ({ request }) => toggleLike(request, 'judgment', 'filesetId')),

    // ---------- Cases ----------
    http.get(url(API_PATHS.casesSearch), async ({ request }) => {
      await wait();
      if (!getCurrentUser(db, request)) {
        return unauthorized();
      }
      const requestUrl = new URL(request.url);
      const keyword = requestUrl.searchParams.get('keyword')?.trim();
      if (!keyword) {
        return validationError('keyword should not be empty');
      }
      const pageQuery = parsePageQuery(requestUrl);
      if (typeof pageQuery === 'string') {
        return validationError(pageQuery);
      }
      const matched = db.cases
        .filter((item) => [item.defendantName, item.defendantPhone, item.defendantIdNo].some((value) => value && value.toLowerCase() === keyword.toLowerCase()))
        .sort(sortCasesNewestFirst)
        .map((item) => toCaseItem(db, item));
      return ok(paginate(matched, pageQuery));
    }),
    http.get(url(API_PATHS.caseDetail), async ({ request }) => {
      await wait();
      const id = Number(new URL(request.url).searchParams.get('id'));
      if (!Number.isInteger(id) || id <= 0) {
        return validationError('id must be a positive integer');
      }
      const record = db.cases.find((item) => item.id === id);
      return record ? ok(toCaseItem(db, record)) : notFound();
    }),
    http.get(url(API_PATHS.cases), async ({ request }) => {
      await wait();
      const requestUrl = new URL(request.url);
      const pageQuery = parsePageQuery(requestUrl);
      if (typeof pageQuery === 'string') {
        return validationError(pageQuery);
      }
      const city = requestUrl.searchParams.get('city');
      const district = requestUrl.searchParams.get('district');
      const filtered = db.cases
        .filter((item) => (!city || item.location === city) && (!district || item.district === district))
        .sort(sortCasesNewestFirst)
        .map((item) => toCaseItem(db, item));
      return ok(paginate(filtered, pageQuery));
    }),
    http.post(url(API_PATHS.cases), async ({ request }) => {
      await wait();
      const user = getCurrentUser(db, request);
      if (!user) {
        return unauthorized();
      }
      const form = await request.formData();
      const text = (key: string) => {
        const value = form.get(key);
        return typeof value === 'string' ? value.trim() : '';
      };
      const images = form.getAll('images').filter((value): value is File => value instanceof File);
      const rent = Number(text('rent'));
      const location = text('location');
      const district = text('district');
      if (!isNonEmptyString(text('title'), CASE_LIMITS.titleMax)) {
        return validationError('title should not be empty');
      }
      if (!isNonEmptyString(text('content'), CASE_LIMITS.contentMax)) {
        return validationError('content should not be empty');
      }
      if (!isTaiwanCity(location) || !isDistrictOfCity(location, district)) {
        return validationError('location or district is invalid');
      }
      if (!Number.isInteger(rent) || rent < CASE_LIMITS.rentMin || rent > CASE_LIMITS.rentMax) {
        return validationError('rent must be an integer between 0 and 1000000');
      }
      if (
        !isNonEmptyString(text('defendantName'), CASE_LIMITS.defendantNameMax) ||
        text('defendantPhone').length > CASE_LIMITS.defendantPhoneMax ||
        text('defendantIdNo').length > CASE_LIMITS.defendantIdNoMax
      ) {
        return validationError('defendant fields are invalid');
      }
      if (
        images.length > IMAGE_LIMITS.maxCount ||
        images.some((file) => file.size > IMAGE_LIMITS.maxSizeBytes || !IMAGE_LIMITS.acceptedTypes.includes(file.type))
      ) {
        return validationError('images are invalid');
      }
      const now = new Date().toISOString();
      const record: CaseRecord = {
        id: db.nextCaseId(),
        title: text('title'),
        content: text('content'),
        location,
        district,
        rent,
        defendantName: text('defendantName'),
        defendantPhone: text('defendantPhone'),
        defendantIdNo: text('defendantIdNo'),
        imageUrls: images.map(blobUrl).filter(Boolean),
        authorDisplayName: user.displayName ?? '',
        baseLikeCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      db.cases.push(record);
      return ok({ id: record.id }, HTTP_STATUS.created);
    }),
    http.get(url(API_PATHS.caseComments), ({ request }) => listComments(request, 'case', 'caseId')),
    http.post(url(API_PATHS.caseComments), ({ request }) => createComment(request, 'case', 'caseId')),
    http.get(url(API_PATHS.caseLikes), ({ request }) => getLikes(request, 'case', 'caseId')),
    http.post(url(API_PATHS.caseLikesToggle), ({ request }) => toggleLike(request, 'case', 'caseId')),

    // ---------- Others ----------
    http.get(url(API_PATHS.stats), async () => {
      await wait();
      return ok({
        judgmentCount: db.cityStats.reduce((sum, item) => sum + item.judgmentCount, 0),
        caseCount: db.cases.length,
        userCount: db.baseUserCount + db.users.length,
      });
    }),
  ];
};
