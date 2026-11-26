import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GavelIcon from '@mui/icons-material/Gavel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Alert, Box, Button, Container, Paper, Skeleton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import type { ReactNode } from 'react';
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom';
import { CommentSection } from '@/features/engagement/components/CommentSection';
import { LikeButton } from '@/features/engagement/components/LikeButton';
import { isApiErrorCode } from '@/shared/api/api-error';
import type { JudgmentDetail } from '@/shared/api/types';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { HighlightText } from '@/shared/components/HighlightText';
import { Seo } from '@/shared/components/Seo';
import { ShareButton } from '@/shared/components/ShareButton';
import { SourceBadge } from '@/shared/components/SourceBadge';
import { API_CODES } from '@/shared/constants/api';
import { buildJudgmentSearchPath, ROUTES, SEARCH_PARAMS } from '@/shared/constants/routes';
import { SOURCE_TYPES } from '@/shared/constants/source';
import { formatCaseNumber } from '@/shared/utils/case-number';
import { formatJudgmentDate } from '@/shared/utils/format-date';
import { formatRent } from '@/shared/utils/format-number';
import { OutcomeChip } from './components/OutcomeChip';
import { PartyNames } from './components/PartyNames';
import { useJudgmentDetail } from './hooks';
import { getJudgmentOutcome } from './outcome';

const DEFAULT_TITLE = '租賃糾紛判決';
const FULL_TEXT_MAX_WIDTH = '72ch';

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2, py: 1.25, '&:not(:last-of-type)': { borderBottom: 1, borderColor: 'divider' } }}>
      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right', overflowWrap: 'anywhere' }}>
        {value}
      </Typography>
    </Stack>
  );
}

function SummaryPanel({ judgment }: { judgment: JudgmentDetail }) {
  const outcome = getJudgmentOutcome(judgment);
  const location = [judgment.city, judgment.district].filter(Boolean).join(' ') || '未標示';
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '16px' }}>
      <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
        判決摘要
      </Typography>
      <Box>
        <InfoRow label="裁判日期" value={formatJudgmentDate(judgment.jdate)} />
        <InfoRow label="案號" value={formatCaseNumber(judgment) || '未標示'} />
        <InfoRow label="地區" value={location} />
        <InfoRow label="月租金" value={formatRent(judgment.rent)} />
        <InfoRow label="勝訴方" value={outcome.winnerName} />
      </Box>
      <Stack spacing={1.5} sx={{ mt: 2 }}>
        <LikeButton target={{ kind: 'judgment', id: judgment.id }} initialCount={judgment.likeCount} />
        {judgment.jpdf && (
          <Button variant="outlined" href={judgment.jpdf} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewIcon />}>
            查看司法院原始文件
          </Button>
        )}
        <ShareButton title={`${judgment.jtitle || DEFAULT_TITLE}｜租屋通`} />
      </Stack>
    </Paper>
  );
}

function DetailSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }} aria-busy="true" aria-label="載入中">
      <Skeleton width={120} />
      <Skeleton width="60%" height={44} sx={{ mt: 2 }} />
      <Skeleton width="30%" />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Skeleton variant="rounded" height={420} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" height={280} />
        </Grid>
      </Grid>
    </Container>
  );
}

export function JudgmentDetailPage() {
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get(SEARCH_PARAMS.keyword) ?? undefined;
  const { data: judgment, isPending, isError, error, refetch } = useJudgmentDetail(id);
  const backPath = keyword ? buildJudgmentSearchPath(keyword) : ROUTES.judgments;

  if (isPending) {
    return <DetailSkeleton />;
  }

  if (isError) {
    const notFound = isApiErrorCode(error, API_CODES.notFound);
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        <Seo title={notFound ? '找不到判決' : '判決載入失敗'} />
        {notFound ? (
          <EmptyState
            icon={<GavelIcon />}
            title="找不到這筆判決"
            description="判決可能已下架，或網址有誤。"
            action={
              <Button component={RouterLink} to={ROUTES.judgments} variant="contained">
                回到判決查詢
              </Button>
            }
          />
        ) : (
          <ErrorState error={error} onRetry={() => void refetch()} />
        )}
      </Container>
    );
  }

  const title = judgment.jtitle || DEFAULT_TITLE;
  const caseNumber = formatCaseNumber(judgment);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Seo
        title={`${title} ${caseNumber}`.trim()}
        description={`${caseNumber} 判決：原告 ${judgment.plaintiff ?? ''}、被告 ${judgment.defendant ?? ''}，裁判日期 ${judgment.jdate}。`}
      />
      <Button component={RouterLink} to={backPath} startIcon={<ArrowBackIcon />} color="inherit" sx={{ mb: 2, color: 'text.secondary' }}>
        {keyword ? `返回「${keyword}」的搜尋結果` : '返回判決查詢'}
      </Button>
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', alignItems: 'center', rowGap: 1 }}>
          <SourceBadge source={SOURCE_TYPES.judgment} />
          <OutcomeChip judgment={judgment} />
        </Stack>
        <Typography variant="h1" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
          {title}
        </Typography>
        {caseNumber && (
          <Typography variant="body1" color="text.secondary">
            {caseNumber} · 裁判日期 {formatJudgmentDate(judgment.jdate)}
          </Typography>
        )}
      </Stack>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ order: { xs: 2, md: 1 } }}>
          <Stack spacing={3}>
            <PartyNames judgment={judgment} keyword={keyword} />
            <Paper variant="outlined" component="section" aria-labelledby="jfull-title" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: '16px' }}>
              <Typography id="jfull-title" variant="h4" component="h2" sx={{ mb: 2 }}>
                判決全文
              </Typography>
              <Typography
                component="div"
                sx={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  maxWidth: FULL_TEXT_MAX_WIDTH,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                  lineHeight: 1.95,
                  letterSpacing: '0.02em',
                  color: 'text.primary',
                }}
              >
                <HighlightText text={judgment.jfull} keyword={keyword} />
              </Typography>
            </Paper>
            <Alert severity="info" icon={<InfoOutlinedIcon />}>
              判決資料來源為司法院公開之裁判書，內容以官方公告為準；同名同姓者眾，請勿僅憑姓名判斷是否為同一人。
            </Alert>
            <CommentSection target={{ kind: 'judgment', id: judgment.id }} initialCount={judgment.commentCount} />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 1, md: 2 } }}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
            <SummaryPanel judgment={judgment} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
