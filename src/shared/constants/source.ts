export const SOURCE_TYPES = {
  judgment: 'judgment',
  community: 'community',
} as const;

export type SourceType = (typeof SOURCE_TYPES)[keyof typeof SOURCE_TYPES];

export const SOURCE_LABELS: Record<SourceType, string> = {
  judgment: '法院判決',
  community: '網友回報・未經查證',
};
