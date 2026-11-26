import { Box } from '@mui/material';
import type { ReactNode } from 'react';

/** 卡片格線：手機 1 欄、桌機 2 欄（wide 時 3 欄）。 */
export function CaseGrid({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', lg: wide ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))' },
      }}
    >
      {children}
    </Box>
  );
}
