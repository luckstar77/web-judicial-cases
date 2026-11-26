import { Card, Skeleton, Stack } from '@mui/material';

export function JudgmentCardSkeleton() {
  return (
    <Card sx={{ p: { xs: 2, sm: 2.5 } }} aria-hidden>
      <Stack spacing={1.5}>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Skeleton variant="rounded" width={88} height={24} />
          <Skeleton width={120} />
        </Stack>
        <Skeleton width="55%" height={28} />
        <Skeleton width="35%" />
        <Skeleton variant="rounded" height={64} />
        <Skeleton width="70%" />
      </Stack>
    </Card>
  );
}
