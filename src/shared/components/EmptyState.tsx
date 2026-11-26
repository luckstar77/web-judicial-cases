import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { BRAND_COLORS } from '@/app/theme';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({ icon, title, description, action, compact = false }: EmptyStateProps) {
  return (
    <Stack
      spacing={1.5}
      sx={{
        alignItems: 'center',
        textAlign: 'center',
        py: compact ? 4 : { xs: 6, md: 8 },
        px: 3,
        border: `1px dashed ${BRAND_COLORS.border}`,
        borderRadius: '16px',
        backgroundColor: 'background.paper',
      }}
    >
      {icon && (
        <Box
          aria-hidden
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            color: 'primary.main',
            backgroundColor: BRAND_COLORS.primaryLight,
            '& svg': { fontSize: 28 },
          }}
        >
          {icon}
        </Box>
      )}
      <Typography variant="h5" component="p">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440 }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ pt: 1 }}>{action}</Box>}
    </Stack>
  );
}
