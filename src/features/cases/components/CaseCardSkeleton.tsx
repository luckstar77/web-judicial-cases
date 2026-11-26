import { Card, Skeleton, Stack } from '@mui/material';

export function CaseCardSkeleton() {
  return (
    <Card sx={{ p: { xs: 2, sm: 2.5 }, height: '100%' }} aria-hidden>
      <Stack spacing={1.5}>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Skeleton variant="rounded" width={150} height={24} />
          <Skeleton width={64} />
        </Stack>
        <Skeleton width="80%" height={28} />
        <Skeleton width="60%" />
        <Skeleton width="100%" />
        <Skeleton width="90%" />
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rounded" width={72} height={72} />
          <Skeleton variant="rounded" width={72} height={72} />
        </Stack>
      </Stack>
    </Card>
  );
}
