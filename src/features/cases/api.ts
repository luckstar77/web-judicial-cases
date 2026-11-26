import { apiGet, apiRequest } from '@/shared/api/client';
import type { CaseDetail, CaseListItem, CaseListParams, CaseSearchParams, CreateCaseInput, CreateCaseResult, Paginated } from '@/shared/api/types';
import { API_PATHS } from '@/shared/constants/api';

const IMAGE_FIELD = 'images';

export const toCaseFormData = (input: CreateCaseInput): FormData => {
  const formData = new FormData();
  formData.append('title', input.title);
  formData.append('content', input.content);
  formData.append('location', input.location);
  formData.append('district', input.district);
  formData.append('rent', String(input.rent));
  formData.append('defendantName', input.defendantName);
  if (input.defendantPhone) {
    formData.append('defendantPhone', input.defendantPhone);
  }
  if (input.defendantIdNo) {
    formData.append('defendantIdNo', input.defendantIdNo);
  }
  input.images.forEach((image) => formData.append(IMAGE_FIELD, image));
  return formData;
};

export const casesApi = {
  list: (params: CaseListParams, signal?: AbortSignal) =>
    apiGet<Paginated<CaseListItem>>(API_PATHS.cases, { page: params.page, limit: params.limit, city: params.city, district: params.district }, signal),
  search: (params: CaseSearchParams, signal?: AbortSignal) =>
    apiGet<Paginated<CaseListItem>>(API_PATHS.casesSearch, { keyword: params.keyword, page: params.page, limit: params.limit }, signal),
  getDetail: (id: number, signal?: AbortSignal) => apiGet<CaseDetail>(API_PATHS.caseDetail, { id }, signal),
  create: (input: CreateCaseInput) => apiRequest<CreateCaseResult>({ method: 'POST', url: API_PATHS.cases, data: toCaseFormData(input) }),
};
