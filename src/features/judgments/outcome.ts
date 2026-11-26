import type { JudgmentListItem } from '@/shared/api/types';
import { JUDGMENT_OUTCOME_LABELS, NO_WINNER_TEXT } from './constants';

export interface JudgmentOutcome {
  label: string;
  winnerName: string;
  hasWinner: boolean;
}

/** 對應舊版 WinnerTypo：勝訴方為原告或被告姓名，皆無則顯示「無」。 */
export const getJudgmentOutcome = (judgment: Pick<JudgmentListItem, 'win' | 'plaintiff' | 'defendant'>): JudgmentOutcome => {
  if (judgment.win === 'plaintiff') {
    return { label: JUDGMENT_OUTCOME_LABELS.plaintiff, winnerName: judgment.plaintiff || NO_WINNER_TEXT, hasWinner: true };
  }
  if (judgment.win === 'defendant') {
    return { label: JUDGMENT_OUTCOME_LABELS.defendant, winnerName: judgment.defendant || NO_WINNER_TEXT, hasWinner: true };
  }
  return { label: JUDGMENT_OUTCOME_LABELS.unknown, winnerName: NO_WINNER_TEXT, hasWinner: false };
};
