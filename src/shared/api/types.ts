/**
 * 租屋通 API v1 合約型別（對應 api-judicial-cases/docs/api-v1.md）。
 */

export interface ApiSuccess<T> {
  status: 'ok';
  code: number;
  data: T;
}

export interface ApiFailure {
  status: 'error';
  code: number;
  error?: { message?: string };
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export interface PaginationMeta {
  take: number;
  page: number;
  pageCount: number;
  itemCount: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Paginated<T> {
  list: T[];
  meta: PaginationMeta;
}

export interface ListResult<T> {
  list: T[];
}

export interface PageParams {
  page?: number;
  limit?: number;
}

// ---------- Auth / Users ----------

export interface UserProfile {
  uid: string;
  phone: string;
  name?: string;
  displayName?: string;
  email?: string;
  /** 是否已設定密碼；只用簡訊登入的帳號為 false（可直接設定第一組密碼）。 */
  hasPassword: boolean;
}

export interface AuthResult {
  user: UserProfile;
  accessToken: string;
}

export interface VerifyRequest {
  firebaseToken: string;
}

export interface RegisterRequest {
  firebaseToken: string;
  password: string;
  name: string;
  displayName: string;
  email: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  email?: string;
  password?: string;
  /** 帶 `password` 且 `hasPassword` 為 true 時必填，錯誤回 40101。 */
  currentPassword?: string;
}

// ---------- Judgments ----------

export type JudgmentWinner = 'plaintiff' | 'defendant';

export interface JudgmentListItem {
  id: string;
  jyear?: string;
  jcase?: string;
  jno?: string;
  /** YYYY-MM-DD */
  jdate: string;
  jtitle?: string;
  plaintiff?: string;
  defendant?: string;
  rent?: number;
  city?: string;
  district?: string;
  win?: JudgmentWinner;
  likeCount: number;
  commentCount: number;
}

export interface JudgmentDetail extends JudgmentListItem {
  jfull: string;
  jpdf?: string;
}

export interface JudgmentSearchParams extends PageParams {
  keyword: string;
}

export interface WarningNameParams {
  city: string;
  rentMin?: number;
  rentMax?: number;
  minCount?: number;
}

export interface WarningName {
  name: string;
  judgmentCount: number;
}

export interface CityStat {
  /** 判決資料格式：`臺北`、`新北`…（臺字、無市/縣） */
  city: string;
  judgmentCount: number;
}

// ---------- Cases ----------

export interface CaseListItem {
  id: number;
  title: string;
  content: string;
  location?: string;
  district?: string;
  rent: number;
  /** 已遮罩 */
  defendantName: string;
  /** 已遮罩 */
  defendantPhone: string;
  /** 已遮罩 */
  defendantIdNo: string;
  imageUrls: string[];
  authorDisplayName?: string;
  likeCount: number;
  commentCount: number;
  /** ISO 8601 */
  createdAt: string;
  /** ISO 8601 */
  updatedAt: string;
}

export type CaseDetail = CaseListItem;

export interface CaseListParams extends PageParams {
  city?: string;
  district?: string;
}

export interface CaseSearchParams extends PageParams {
  keyword: string;
}

export interface CreateCaseInput {
  title: string;
  content: string;
  location: string;
  district: string;
  rent: number;
  defendantName: string;
  defendantPhone?: string;
  defendantIdNo?: string;
  images: File[];
}

export interface CreateCaseResult {
  id: number;
}

// ---------- Engagement ----------

export interface Comment {
  id: number;
  content: string;
  authorDisplayName?: string;
  ipMasked?: string;
  createdAt: string;
}

export interface LikeState {
  likeCount: number;
  liked: boolean;
}

// ---------- Others ----------

export interface SiteStats {
  judgmentCount: number;
  caseCount: number;
  userCount: number;
}
