import { createCaseFixtures, type CaseRecord } from './fixtures/cases';
import { commentTargetKey, createCommentFixtures, type CommentRecord } from './fixtures/comments';
import { CITY_STATS_FIXTURE, createJudgmentFixtures, type JudgmentRecord } from './fixtures/judgments';
import { createUserFixtures, type UserRecord } from './fixtures/users';

const BASE_USER_COUNT = 1286;

export interface MockDb {
  judgments: JudgmentRecord[];
  cases: CaseRecord[];
  comments: CommentRecord[];
  users: UserRecord[];
  /** targetKey → 按讚使用者 uid */
  likes: Map<string, Set<string>>;
  cityStats: typeof CITY_STATS_FIXTURE;
  baseUserCount: number;
  nextCaseId: () => number;
  nextCommentId: () => number;
}

/** 建立記憶體資料庫（重新整理頁面即重置；測試可各自建立）。 */
export const createMockDb = (now: Date = new Date()): MockDb => {
  const judgments = createJudgmentFixtures();
  const cases = createCaseFixtures(now);
  const targets = [...judgments.map((item) => commentTargetKey('judgment', item.id)), ...cases.map((item) => commentTargetKey('case', item.id))];
  const comments = createCommentFixtures(targets, now);
  let caseId = Math.max(0, ...cases.map((item) => item.id));
  let commentId = Math.max(0, ...comments.map((item) => item.id));
  return {
    judgments,
    cases,
    comments,
    users: createUserFixtures(),
    likes: new Map(),
    cityStats: CITY_STATS_FIXTURE,
    baseUserCount: BASE_USER_COUNT,
    nextCaseId: () => {
      caseId += 1;
      return caseId;
    },
    nextCommentId: () => {
      commentId += 1;
      return commentId;
    },
  };
};
