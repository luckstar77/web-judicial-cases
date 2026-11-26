import { z } from 'zod';
import type { CreateCaseInput } from '@/shared/api/types';
import { isDistrictOfCity, isTaiwanCity } from '@/shared/constants/taiwan-districts';
import { CASE_LIMITS, IMAGE_LIMITS } from './constants';

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, { error: `請輸入${label}` })
    .max(max, { error: `${label}最多 ${max} 個字` });

const optionalText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `${label}最多 ${max} 個字元` });

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => IMAGE_LIMITS.acceptedTypes.includes(file.type), { error: '僅支援 JPG、PNG、WebP、GIF 圖片' })
  .refine((file) => file.size <= IMAGE_LIMITS.maxSizeBytes, { error: `每張圖片需小於 ${IMAGE_LIMITS.maxSizeMb}MB` });

/** 網友回報表單：限制與 POST /v1/cases 合約一致。 */
export const caseCreateSchema = z
  .object({
    defendantName: requiredText('對象姓名', CASE_LIMITS.defendantNameMax),
    defendantPhone: optionalText('電話', CASE_LIMITS.defendantPhoneMax),
    defendantIdNo: optionalText('身分證', CASE_LIMITS.defendantIdNoMax),
    location: z.string().refine(isTaiwanCity, { error: '請選擇縣市' }),
    district: z.string().min(1, { error: '請選擇行政區' }),
    rent: z
      .number({ error: '請輸入月租金（數字）' })
      .int({ error: '月租金需為整數' })
      .min(CASE_LIMITS.rentMin, { error: '月租金不可小於 0' })
      .max(CASE_LIMITS.rentMax, { error: '月租金不可超過 1,000,000' }),
    title: requiredText('標題', CASE_LIMITS.titleMax),
    content: requiredText('事件經過', CASE_LIMITS.contentMax),
    images: z.array(imageFileSchema).max(IMAGE_LIMITS.maxCount, { error: `最多上傳 ${IMAGE_LIMITS.maxCount} 張圖片` }),
    agreement: z.boolean().refine((value) => value, { error: '請確認並同意發文規範' }),
  })
  .refine((values) => !values.location || !values.district || isDistrictOfCity(values.location, values.district), {
    error: '行政區不屬於所選縣市',
    path: ['district'],
  });

export type CaseCreateFormInput = z.input<typeof caseCreateSchema>;
export type CaseCreateFormValues = z.output<typeof caseCreateSchema>;
export type CaseCreateField = keyof CaseCreateFormValues;

export const CASE_FORM_STEPS: { label: string; fields: CaseCreateField[] }[] = [
  { label: '對象資訊', fields: ['defendantName', 'defendantPhone', 'defendantIdNo'] },
  { label: '租屋資訊', fields: ['location', 'district', 'rent'] },
  { label: '事件經過', fields: ['title', 'content'] },
  { label: '證據照片', fields: ['images', 'agreement'] },
];

export const CASE_FORM_DEFAULTS: CaseCreateFormInput = {
  defendantName: '',
  defendantPhone: '',
  defendantIdNo: '',
  location: '',
  district: '',
  rent: Number.NaN,
  title: '',
  content: '',
  images: [],
  agreement: false,
};

export const toCreateCaseInput = (values: CaseCreateFormValues): CreateCaseInput => ({
  title: values.title,
  content: values.content,
  location: values.location,
  district: values.district,
  rent: values.rent,
  defendantName: values.defendantName,
  defendantPhone: values.defendantPhone || undefined,
  defendantIdNo: values.defendantIdNo || undefined,
  images: values.images,
});
