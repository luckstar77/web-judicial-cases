import { createRandom } from '../utils';

export interface CommentRecord {
  id: number;
  targetKey: string;
  content: string;
  authorDisplayName?: string;
  ip: string;
  createdAt: string;
}

const COMMENT_TEXTS = [
  '感謝分享，我也差點租到這間，幸好先查了一下。',
  '同區的房東可以多注意，簽約前記得核對身分證正本。',
  '建議保留所有匯款紀錄和對話截圖，之後走調解會很有幫助。',
  '我之前也遇過類似狀況，最後是透過區公所調解委員會處理的。',
  '可以先寄存證信函，再聲請支付命令，費用不高。',
  '同名同姓很多，大家還是要看清楚地區和細節再判斷喔。',
  '點交時一定要錄影！這篇提醒得很好。',
  '請問最後有拿回押金嗎？',
  '支持理性分享，讓租屋市場更透明。',
  '這種情況可以撥打 1999 詢問租賃爭議諮詢。',
];

const AUTHORS = ['租屋新手', '板橋房東', '路過的律師助理', '台中小資', undefined, '高雄阿明', '熱心網友', '包租婆日記'];
const IPS = ['35.78.212.43', '114.32.19.8', '61.220.45.101', '2001:db8:85a3::8a2e:370:7334', '118.163.77.2', '220.135.9.66'];
const MS_PER_HOUR = 3_600_000;
const MAX_HOURS_AGO = 600;

export const commentTargetKey = (kind: 'judgment' | 'case', id: string | number) => `${kind}:${id}`;

/** 為每個目標產生 0–4 則留言（舊到新）。 */
export const createCommentFixtures = (targets: string[], now: Date = new Date()): CommentRecord[] => {
  const random = createRandom(4242);
  const records: CommentRecord[] = [];
  let id = 1;
  targets.forEach((targetKey) => {
    const count = random.int(0, 4);
    const hours = Array.from({ length: count }, () => random.int(1, MAX_HOURS_AGO)).sort((a, b) => b - a);
    hours.forEach((hoursAgo) => {
      records.push({
        id,
        targetKey,
        content: random.pick(COMMENT_TEXTS),
        authorDisplayName: random.pick(AUTHORS),
        ip: random.pick(IPS),
        createdAt: new Date(now.getTime() - hoursAgo * MS_PER_HOUR).toISOString(),
      });
      id += 1;
    });
  });
  return records;
};
