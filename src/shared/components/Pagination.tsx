import { Pagination as MuiPagination, Stack } from '@mui/material';

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }
  return (
    <Stack component="nav" aria-label="分頁" sx={{ alignItems: 'center', mt: 4 }}>
      <MuiPagination
        page={page}
        count={pageCount}
        color="primary"
        shape="rounded"
        siblingCount={1}
        boundaryCount={1}
        onChange={(_event, value) => onChange(value)}
        getItemAriaLabel={(type, itemPage) => {
          if (type === 'page') {
            return `第 ${itemPage} 頁`;
          }
          return type === 'next' ? '下一頁' : type === 'previous' ? '上一頁' : type === 'first' ? '第一頁' : '最後一頁';
        }}
      />
    </Stack>
  );
}
