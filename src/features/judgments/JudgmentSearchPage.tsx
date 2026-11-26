import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useSearchParams } from 'react-router-dom';
import { useCommunitySearch } from '@/features/cases/use-community-search';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { PageContainer } from '@/shared/components/PageContainer';
import { Pagination } from '@/shared/components/Pagination';
import { SearchField } from '@/shared/components/SearchField';
import { Seo } from '@/shared/components/Seo';
import { SEARCH_PARAMS } from '@/shared/constants/routes';
import { formatNumber } from '@/shared/utils/format-number';
import { JudgmentCard } from './components/JudgmentCard';
import { JudgmentCardSkeleton } from './components/JudgmentCardSkeleton';
import { useJudgmentSearch } from './hooks';

const FIRST_PAGE = 1;
const SKELETON_COUNT = 3;

const parsePage = (value: string | null): number => {
  const page = Number(value);
  return Number.isInteger(page) && page >= FIRST_PAGE ? page : FIRST_PAGE;
};

const SEARCH_TIPS = [
  '請輸入完整姓名，系統會比對判決中的原告或被告姓名（完全相符）。',
  '同名同姓的情況很常見，請搭配地區、租金與判決內容判斷是否為同一人。',
  '查無判決不代表沒有糾紛，也可以看看網友回報。',
];

function SearchTips({ keyword }: { keyword: string }) {
  const searchCommunity = useCommunitySearch();
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '16px', position: { md: 'sticky' }, top: { md: 88 } }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <FactCheckOutlinedIcon color="primary" />
          <Typography variant="h5" component="h2">
            查詢小提醒
          </Typography>
        </Stack>
        <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 1, color: 'text.secondary', typography: 'body2' } }}>
          {SEARCH_TIPS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </Box>
        {keyword && (
          <Button variant="outlined" startIcon={<ForumOutlinedIcon />} onClick={() => searchCommunity(keyword)}>
            查「{keyword}」的網友回報
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

export function JudgmentSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = (searchParams.get(SEARCH_PARAMS.keyword) ?? '').trim();
  const page = parsePage(searchParams.get(SEARCH_PARAMS.page));
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useJudgmentSearch(keyword, page);
  const searchCommunity = useCommunitySearch();

  const handleSearch = (nextKeyword: string) => {
    setSearchParams({ [SEARCH_PARAMS.keyword]: nextKeyword });
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams({ [SEARCH_PARAMS.keyword]: keyword, [SEARCH_PARAMS.page]: String(nextPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderResults = () => {
    if (!keyword) {
      return (
        <EmptyState
          icon={<ManageSearchIcon />}
          title="輸入姓名，查詢租賃糾紛判決"
          description="輸入房東或房客的完整姓名，即可查詢公開的法院判決紀錄，包含裁判日期、地區、租金與勝訴方。"
        />
      );
    }
    if (isPending) {
      return (
        <Stack spacing={2} aria-busy="true" aria-label="搜尋中">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <JudgmentCardSkeleton key={index} />
          ))}
        </Stack>
      );
    }
    if (isError) {
      return <ErrorState error={error} onRetry={() => void refetch()} />;
    }
    if (data.list.length === 0) {
      return (
        <EmptyState
          icon={<SearchOffIcon />}
          title={`查無「${keyword}」的判決紀錄`}
          description="查無判決不代表沒有爭議紀錄。你也可以看看網友回報，或確認姓名是否輸入正確。"
          action={
            <Button variant="contained" startIcon={<ForumOutlinedIcon />} onClick={() => searchCommunity(keyword)}>
              搜尋網友回報
            </Button>
          }
        />
      );
    }
    return (
      <Box sx={{ opacity: isPlaceholderData ? 0.6 : 1, transition: 'opacity .2s' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} aria-live="polite">
          找到 <strong>{formatNumber(data.meta.totalCount)}</strong> 筆與「{keyword}」相關的判決，依裁判日期新到舊排列
        </Typography>
        <Stack spacing={2}>
          {data.list.map((judgment) => (
            <JudgmentCard key={judgment.id} judgment={judgment} keyword={keyword} />
          ))}
        </Stack>
        <Pagination page={data.meta.page} pageCount={data.meta.pageCount} onChange={handlePageChange} />
      </Box>
    );
  };

  return (
    <PageContainer title="判決查詢" subtitle="查詢公開的租賃糾紛法院判決，簽約前多一分保障">
      <Seo
        title={keyword ? `「${keyword}」的判決查詢結果` : '判決查詢'}
        description="輸入房東或房客姓名，查詢公開的租賃糾紛法院判決紀錄，包含裁判日期、地區、租金與勝訴方。"
      />
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <SearchField key={keyword} defaultValue={keyword} label="輸入姓名查詢判決" placeholder="輸入房東或房客的完整姓名" onSubmit={handleSearch} />
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>{renderResults()}</Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SearchTips keyword={keyword} />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
