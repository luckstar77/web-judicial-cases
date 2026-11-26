import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { Button, Container, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { EmptyState } from '@/shared/components/EmptyState';
import { Seo } from '@/shared/components/Seo';
import { ROUTES } from '@/shared/constants/routes';

export function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Seo title="找不到頁面" />
      <EmptyState
        icon={<TravelExploreIcon />}
        title="找不到這個頁面"
        description="網址可能有誤，或頁面已經移除。"
        action={
          <Stack direction="row" spacing={1.5}>
            <Button component={RouterLink} to={ROUTES.home} variant="contained">
              回到首頁
            </Button>
            <Button component={RouterLink} to={ROUTES.judgments} variant="outlined">
              查詢判決
            </Button>
          </Stack>
        }
      />
    </Container>
  );
}
