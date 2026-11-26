const numberFormatter = new Intl.NumberFormat('zh-TW');

export const formatNumber = (value: number): string => numberFormatter.format(value);

/** 月租顯示：`12,000 元`；0 或未提供顯示 `未提供`。 */
export const formatRent = (rent?: number): string => {
  if (rent === undefined || rent === null || rent <= 0) {
    return '未提供';
  }
  return `${numberFormatter.format(rent)} 元`;
};
