import type { JudgmentListItem } from '@/shared/api/types';

const ID_SEPARATOR = ',';
const ID_YEAR_INDEX = 1;
const ID_CASE_INDEX = 2;
const ID_NO_INDEX = 3;
const ID_MIN_PARTS = 4;

type CaseNumberParts = Pick<JudgmentListItem, 'jyear' | 'jcase' | 'jno'>;

/** 解析判決 id，例：`CCEV,100,潮簡,260,20110811,1` → 年度 / 字別 / 號。 */
export const parseJudgmentId = (id: string): CaseNumberParts => {
  const parts = id.split(ID_SEPARATOR);
  if (parts.length < ID_MIN_PARTS) {
    return {};
  }
  return { jyear: parts[ID_YEAR_INDEX], jcase: parts[ID_CASE_INDEX], jno: parts[ID_NO_INDEX] };
};

/** `{jyear}年度{jcase}字第{jno}號`；欄位缺漏時從 id 解析，仍無法組成則回傳空字串。 */
export const formatCaseNumber = (judgment: CaseNumberParts & { id?: string }): string => {
  const fallback = judgment.id ? parseJudgmentId(judgment.id) : {};
  const jyear = judgment.jyear || fallback.jyear;
  const jcase = judgment.jcase || fallback.jcase;
  const jno = judgment.jno || fallback.jno;
  if (!jyear || !jcase || !jno) {
    return '';
  }
  return `${jyear}年度${jcase}字第${jno}號`;
};
