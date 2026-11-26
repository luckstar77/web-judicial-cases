import { describe, expect, it } from 'vitest';
import { toCaseCity, toJudgmentCity, toMapCountyName, toMapCountyNames } from './city-name';

describe('city name mapping', () => {
  it('normalizes any format to the judgment format', () => {
    expect(toJudgmentCity('台北市')).toBe('臺北');
    expect(toJudgmentCity('臺北市')).toBe('臺北');
    expect(toJudgmentCity('臺北')).toBe('臺北');
    expect(toJudgmentCity('新竹縣')).toBe('新竹');
    expect(toJudgmentCity('台東縣')).toBe('臺東');
  });

  it('maps judgment cities to map county names', () => {
    expect(toMapCountyNames('臺北')).toEqual(['臺北市']);
    expect(toMapCountyNames('桃園')).toEqual(['桃園市']);
    expect(toMapCountyNames('臺東')).toEqual(['臺東縣']);
  });

  it('maps 新竹 and 嘉義 to both city and county', () => {
    expect(toMapCountyNames('新竹')).toEqual(['新竹市', '新竹縣']);
    expect(toMapCountyNames('嘉義')).toEqual(['嘉義市', '嘉義縣']);
  });

  it('maps map / judgment names back to the case city list format', () => {
    expect(toCaseCity('臺北市')).toBe('台北市');
    expect(toCaseCity('臺北')).toBe('台北市');
    expect(toCaseCity('新竹縣')).toBe('新竹縣');
    expect(toCaseCity('新竹')).toBe('新竹市');
    expect(toCaseCity('火星市')).toBeUndefined();
  });

  it('maps case city to map county name', () => {
    expect(toMapCountyName('台中市')).toBe('臺中市');
    expect(toMapCountyName('嘉義縣')).toBe('嘉義縣');
  });
});
