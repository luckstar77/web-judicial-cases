import { Box, Container, Stack, Typography, type ContainerProps } from '@mui/material';
import type { ReactNode } from 'react';

interface PageContainerProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  maxWidth?: ContainerProps['maxWidth'];
}

export function PageContainer({ title, subtitle, actions, children, maxWidth = 'lg' }: PageContainerProps) {
  return (
    <Container maxWidth={maxWidth} sx={{ py: { xs: 3, md: 5 } }}>
      {(title || actions) && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: { xs: 3, md: 4 }, alignItems: { xs: 'flex-start', sm: 'flex-end' }, justifyContent: 'space-between' }}
        >
          <Box sx={{ minWidth: 0 }}>
            {title && (
              <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
        </Stack>
      )}
      {children}
    </Container>
  );
}
