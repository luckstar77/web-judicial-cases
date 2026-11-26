import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CaseCard } from '@/features/cases/components/CaseCard';
import { CaseCardSkeleton } from '@/features/cases/components/CaseCardSkeleton';
import { CaseGrid } from '@/features/cases/components/CaseGrid';
import { LATEST_CASES_COUNT } from '@/features/cases/constants';
import { useLatestCases } from '@/features/cases/hooks';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { ROUTES } from '@/shared/constants/routes';

export function LatestCasesSection() {
  const { data, isPending, isError, error, refetch } = useLatestCases();

  const renderContent = () => {
    if (isPending) {
      return (
        <CaseGrid wide>
          {Array.from({ length: LATEST_CASES_COUNT }, (_, index) => (
            <CaseCardSkeleton key={index} />
          ))}
        </CaseGrid>
      );
    }
    if (isError) {
      return <ErrorState error={error} onRetry={() => void refetch()} />;
    }
    if (data.length === 0) {
      return <EmptyState icon={<ForumOutlinedIcon />} title="還沒有網友回報" description="成為第一個分享經驗的人吧！" />;
    }
    return (
      <CaseGrid wide>
        {data.map((item) => (
          <CaseCard key={item.id} item={item} />
        ))}
      </CaseGrid>
    );
  };

  return (
    <Container maxWidth="lg" component="section" aria-labelledby="latest-cases-title" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, mb: 3 }}
      >
        <div>
          <Typography id="latest-cases-title" variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            最新網友回報
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            來自房東與房客的第一手經驗，內容未經查證，請審慎參考
          </Typography>
        </div>
        <Stack direction="row" spacing={1.5}>
          <Button component={RouterLink} to={ROUTES.cases} variant="outlined" endIcon={<ArrowForwardIcon />}>
            查看全部
          </Button>
          <Button component={RouterLink} to={ROUTES.caseCreate} variant="contained" color="secondary" startIcon={<AddIcon />}>
            我要回報
          </Button>
        </Stack>
      </Stack>
      {renderContent()}
    </Container>
  );
}
