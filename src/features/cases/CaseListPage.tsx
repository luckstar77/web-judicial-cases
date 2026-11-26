import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Alert, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth-context';
import type { CaseListItem, Paginated } from '@/shared/api/types';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { PageContainer } from '@/shared/components/PageContainer';
import { SearchField } from '@/shared/components/SearchField';
import { Seo } from '@/shared/components/Seo';
import { ROUTES, SEARCH_PARAMS } from '@/shared/constants/routes';
import { formatNumber } from '@/shared/utils/format-number';
import { CaseCard } from './components/CaseCard';
import { CaseCardSkeleton } from './components/CaseCardSkeleton';
import { CaseFilters, type CaseFilterValue } from './components/CaseFilters';
import { CaseGrid } from './components/CaseGrid';
import { useCaseFeed, useCaseSearch } from './hooks';
import { COMMUNITY_SEARCH_REASON } from './use-community-search';

const SKELETON_COUNT = 4;

type CaseInfiniteQuery = UseInfiniteQueryResult<InfiniteData<Paginated<CaseListItem>>>;

interface CaseResultsProps {
  query: CaseInfiniteQuery;
  emptyState: ReactNode;
  summary?: (totalCount: number) => ReactNode;
}

function CaseResults({ query, emptyState, summary }: CaseResultsProps) {
  const { data, isPending, isError, error, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } = query;

  if (isPending) {
    return (
      <CaseGrid>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <CaseCardSkeleton key={index} />
        ))}
      </CaseGrid>
    );
  }
  if (isError) {
    return <ErrorState error={error} onRetry={() => void refetch()} />;
  }
  const items = data.pages.flatMap((page) => page.list);
  if (items.length === 0) {
    return <>{emptyState}</>;
  }
  const totalCount = data.pages[0]?.meta.totalCount ?? items.length;
  return (
    <Stack spacing={2}>
      {summary && (
        <Typography variant="body2" color="text.secondary" aria-live="polite">
          {summary(totalCount)}
        </Typography>
      )}
      <CaseGrid>
        {items.map((item) => (
          <CaseCard key={item.id} item={item} />
        ))}
      </CaseGrid>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        {hasNextPage ? (
          <Button variant="outlined" size="large" onClick={() => void fetchNextPage()} disabled={isFetchingNextPage} sx={{ minWidth: 200 }}>
            {isFetchingNextPage ? '載入中…' : '載入更多'}
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary">
            已經到底囉，共 {formatNumber(items.length)} 則
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

function SearchResults({ keyword, onClear }: { keyword: string; onClear: () => void }) {
  const { isAuthenticated, openAuthDialog } = useAuth();
  const query = useCaseSearch(keyword, isAuthenticated);

  if (!isAuthenticated) {
    return (
      <EmptyState
        icon={<LockOutlinedIcon />}
        title="登入後即可查看搜尋結果"
        description={COMMUNITY_SEARCH_REASON}
        action={
          <Button variant="contained" onClick={() => openAuthDialog({ reason: COMMUNITY_SEARCH_REASON })}>
            登入 / 註冊
          </Button>
        }
      />
    );
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}>
        <Typography variant="h5" component="h2">
          搜尋結果
        </Typography>
        <Chip
          label={keyword}
          onDelete={onClear}
          deleteIcon={<CloseIcon />}
          color="primary"
          variant="outlined"
          aria-label={`搜尋關鍵字 ${keyword}，按刪除清除搜尋`}
        />
      </Stack>
      <CaseResults
        query={query}
        summary={(total) => `找到 ${formatNumber(total)} 則與「${keyword}」完全相符的回報`}
        emptyState={
          <EmptyState
            icon={<SearchOffIcon />}
            title={`沒有「${keyword}」的網友回報`}
            description="目前沒有人回報這位對象。若你有相關經驗，歡迎分享，幫助下一位租屋者。"
            action={
              <Button component={RouterLink} to={ROUTES.caseCreate} variant="contained" startIcon={<AddIcon />}>
                我要回報
              </Button>
            }
          />
        }
      />
    </Stack>
  );
}

function Feed({ filters, onFiltersChange }: { filters: CaseFilterValue; onFiltersChange: (value: CaseFilterValue) => void }) {
  const query = useCaseFeed(filters);
  const scope = [filters.city, filters.district].filter(Boolean).join(' ');
  return (
    <Stack spacing={3}>
      <CaseFilters value={filters} onChange={onFiltersChange} />
      <CaseResults
        query={query}
        summary={(total) => `${scope ? `${scope}・` : ''}共 ${formatNumber(total)} 則回報，依發布時間新到舊排列`}
        emptyState={
          <EmptyState
            icon={<ForumOutlinedIcon />}
            title={scope ? `${scope}還沒有網友回報` : '還沒有網友回報'}
            description="成為第一個分享經驗的人，幫助下一位租屋者避開風險。"
            action={
              <Button component={RouterLink} to={ROUTES.caseCreate} variant="contained" startIcon={<AddIcon />}>
                我要回報
              </Button>
            }
          />
        }
      />
    </Stack>
  );
}

export function CaseListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { requireAuth } = useAuth();
  const keyword = (searchParams.get(SEARCH_PARAMS.keyword) ?? '').trim();
  const filters: CaseFilterValue = {
    city: searchParams.get(SEARCH_PARAMS.city) || undefined,
    district: searchParams.get(SEARCH_PARAMS.district) || undefined,
  };

  const handleFiltersChange = (value: CaseFilterValue) => {
    const next = new URLSearchParams();
    if (value.city) {
      next.set(SEARCH_PARAMS.city, value.city);
    }
    if (value.district) {
      next.set(SEARCH_PARAMS.district, value.district);
    }
    setSearchParams(next);
  };

  const handleSearch = (nextKeyword: string) => {
    requireAuth(() => setSearchParams({ [SEARCH_PARAMS.keyword]: nextKeyword }), COMMUNITY_SEARCH_REASON);
  };

  return (
    <PageContainer
      title="網友回報"
      subtitle="房東與房客分享的租屋經驗，內容未經查證，請審慎參考並自行查證。"
      actions={
        <Button component={RouterLink} to={ROUTES.caseCreate} variant="contained" color="secondary" startIcon={<AddIcon />}>
          我要回報
        </Button>
      }
    >
      <Seo title={keyword ? `「${keyword}」的網友回報` : '網友回報'} description="房東與房客分享的真實租屋經驗與糾紛回報，簽約前先看看。" />
      <Stack spacing={3}>
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, borderRadius: '16px' }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <LockOutlinedIcon fontSize="small" color="primary" aria-hidden />
              <Typography variant="subtitle1" component="h2">
                精確搜尋對象
              </Typography>
            </Stack>
            <SearchField key={keyword} defaultValue={keyword} label="輸入對象姓名、電話或身分證" placeholder="姓名、電話或身分證" onSubmit={handleSearch} />
            <Typography variant="caption" color="text.secondary">
              為保護當事人隱私，搜尋需登入，且僅顯示完全相符的回報。
            </Typography>
          </Stack>
        </Paper>
        <Alert severity="warning" variant="outlined" sx={{ borderRadius: '12px', backgroundColor: 'background.paper' }}>
          網友回報為使用者自行提供，平台未經查證。請以判決資料與當面核對身分證為準。
        </Alert>
        {keyword ? <SearchResults keyword={keyword} onClear={() => setSearchParams({})} /> : <Feed filters={filters} onFiltersChange={handleFiltersChange} />}
      </Stack>
    </PageContainer>
  );
}
