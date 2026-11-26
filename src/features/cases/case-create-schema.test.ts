import { describe, expect, it } from 'vitest';
import { caseCreateSchema, type CaseCreateFormInput, toCreateCaseInput } from './case-create-schema';
import { IMAGE_LIMITS } from './constants';

const validInput = (): CaseCreateFormInput => ({
  defendantName: '王大明',
  defendantPhone: '',
  defendantIdNo: '',
  location: '台北市',
  district: '大安區',
  rent: 18000,
  title: '房客欠租三個月',
  content: '【發生經過】連續三個月未繳房租。',
  images: [],
  agreement: true,
});

const imageFile = (name: string, type: string, size = 1024) => new File([new Uint8Array(size)], name, { type });

const errorPaths = (input: CaseCreateFormInput) => {
  const result = caseCreateSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join('.'));
};

describe('caseCreateSchema', () => {
  it('accepts a valid case', () => {
    expect(caseCreateSchema.safeParse(validInput()).success).toBe(true);
  });

  it('requires defendant name, title and content', () => {
    expect(errorPaths({ ...validInput(), defendantName: ' ', title: '', content: '' })).toEqual(expect.arrayContaining(['defendantName', 'title', 'content']));
  });

  it('enforces contract max lengths', () => {
    expect(errorPaths({ ...validInput(), title: 'a'.repeat(101) })).toContain('title');
    expect(errorPaths({ ...validInput(), content: 'a'.repeat(5001) })).toContain('content');
    expect(errorPaths({ ...validInput(), defendantName: 'a'.repeat(33) })).toContain('defendantName');
    expect(errorPaths({ ...validInput(), defendantPhone: '0'.repeat(17) })).toContain('defendantPhone');
    expect(errorPaths({ ...validInput(), defendantIdNo: 'A'.repeat(17) })).toContain('defendantIdNo');
  });

  it('validates rent as an integer between 0 and 1,000,000', () => {
    expect(errorPaths({ ...validInput(), rent: Number.NaN })).toContain('rent');
    expect(errorPaths({ ...validInput(), rent: -1 })).toContain('rent');
    expect(errorPaths({ ...validInput(), rent: 1_000_001 })).toContain('rent');
    expect(errorPaths({ ...validInput(), rent: 1.5 })).toContain('rent');
    expect(errorPaths({ ...validInput(), rent: 0 })).toEqual([]);
  });

  it('requires a city from the Taiwan list and a district of that city', () => {
    expect(errorPaths({ ...validInput(), location: '火星市' })).toContain('location');
    expect(errorPaths({ ...validInput(), district: '板橋區' })).toContain('district');
  });

  it('limits images by count, size and type', () => {
    const tooMany = Array.from({ length: IMAGE_LIMITS.maxCount + 1 }, (_, index) => imageFile(`${index}.png`, 'image/png'));
    expect(errorPaths({ ...validInput(), images: tooMany })).toContain('images');
    expect(errorPaths({ ...validInput(), images: [imageFile('big.jpg', 'image/jpeg', IMAGE_LIMITS.maxSizeBytes + 1)] })).toContain('images.0');
    expect(errorPaths({ ...validInput(), images: [imageFile('doc.pdf', 'application/pdf')] })).toContain('images.0');
    expect(errorPaths({ ...validInput(), images: [imageFile('ok.webp', 'image/webp')] })).toEqual([]);
  });

  it('requires agreeing to the posting guidelines', () => {
    expect(errorPaths({ ...validInput(), agreement: false })).toContain('agreement');
  });

  it('drops empty optional fields when building the request', () => {
    const parsed = caseCreateSchema.parse(validInput());
    expect(toCreateCaseInput(parsed)).toMatchObject({ defendantPhone: undefined, defendantIdNo: undefined, rent: 18000 });
  });
});
