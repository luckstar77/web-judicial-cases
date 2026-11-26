import { describe, expect, it } from 'vitest';
import { formatCaseNumber, parseJudgmentId } from './case-number';

describe('formatCaseNumber', () => {
  it('formats jyear / jcase / jno', () => {
    expect(formatCaseNumber({ jyear: '112', jcase: '北簡', jno: '1234' })).toBe('112年度北簡字第1234號');
  });

  it('falls back to parsing the judgment id', () => {
    expect(formatCaseNumber({ id: 'CCEV,100,潮簡,260,20110811,1' })).toBe('100年度潮簡字第260號');
  });

  it('returns empty string when parts are missing', () => {
    expect(formatCaseNumber({ jyear: '112' })).toBe('');
    expect(formatCaseNumber({ id: 'invalid' })).toBe('');
  });
});

describe('parseJudgmentId', () => {
  it('extracts year, case type and number', () => {
    expect(parseJudgmentId('TPEV,112,北小,2860,20230402,1')).toEqual({ jyear: '112', jcase: '北小', jno: '2860' });
  });
});
