import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { Alert, Avatar, Box, Button, Container, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { BRAND_COLORS } from '@/app/theme';
import { CommentSection } from '@/features/engagement/components/CommentSection';
import { LikeButton } from '@/features/engagement/components/LikeButton';
import { isApiErrorCode } from '@/shared/api/api-error';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { Seo } from '@/shared/components/Seo';
import { ShareButton } from '@/shared/components/ShareButton';
import { SourceBadge } from '@/shared/components/SourceBadge';
import { API_CODES } from '@/shared/constants/api';
import { buildCaseListPath, ROUTES } from '@/shared/constants/routes';
import { SOURCE_TYPES } from '@/shared/constants/source';
import { formatDate, formatRelativeTime } from '@/shared/utils/format-date';
import { formatRent } from '@/shared/utils/format-number';
import { ImageGallery } from './components/ImageGallery';
import { TargetInfo } from './components/TargetInfo';
import { useCaseDetail } from './hooks';

const ANONYMOUS_AUTHOR = '匿名網友';
const DESCRIPTION_LENGTH = 80;

function DetailSkeleton() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }} aria-busy="true" aria-label="載入中">
      <Skeleton width={120} />
      <Skeleton width="70%" height={44} sx={{ mt: 2 }} />
      <Skeleton width="40%" />
      <Skeleton variant="rounded" height={120} sx={{ mt: 3 }} />
      <Skeleton variant="rounded" height={240} sx={{ mt: 3 }} />
    </Container>
  );
}

export function CaseDetailPage() {
  const { id } = useParams();
  const caseId = Number(id);
  const { data: item, isPending, isError, error, refetch } = useCaseDetail(caseId);
  const invalidId = !Number.isInteger(caseId) || caseId <= 0;

  if (invalidId || isError) {
    const notFound = invalidId || isApiErrorCode(error, API_CODES.notFound);
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        <Seo title={notFound ? '找不到回報' : '回報載入失敗'} />
        {notFound ? (
          <EmptyState
            icon={<ForumOutlinedIcon />}
            title="找不到這則回報"
            description="回報可能已被刪除，或網址有誤。"
            action={
              <Button component={RouterLink} to={ROUTES.cases} variant="contained">
                回到網友回報
              </Button>
            }
          />
        ) : (
          <ErrorState error={error} onRetry={() => void refetch()} />
        )}
      </Container>
    );
  }

  if (isPending) {
    return <DetailSkeleton />;
  }

  const author = item.authorDisplayName || ANONYMOUS_AUTHOR;
  const location = [item.location, item.district].filter(Boolean).join(' ');

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Seo title={item.title} description={item.content.slice(0, DESCRIPTION_LENGTH)} />
      <Button component={RouterLink} to={ROUTES.cases} startIcon={<ArrowBackIcon />} color="inherit" sx={{ mb: 2, color: 'text.secondary' }}>
        返回網友回報
      </Button>
      <Stack spacing={3}>
        <Stack spacing={1.5}>
          <Box>
            <SourceBadge source={SOURCE_TYPES.community} />
          </Box>
          <Typography variant="h1" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, overflowWrap: 'anywhere' }}>
            {item.title}
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: BRAND_COLORS.accentLight, color: BRAND_COLORS.accentDark, fontSize: '0.875rem' }} aria-hidden>
              {author.slice(0, 1)}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              <strong>{author}</strong> ·{' '}
              <time dateTime={item.createdAt} title={formatDate(item.createdAt)}>
                {formatRelativeTime(item.createdAt)}
              </time>
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {location && (
              <Button
                component={RouterLink}
                to={buildCaseListPath({ city: item.location, district: item.district })}
                size="small"
                variant="outlined"
                color="inherit"
                startIcon={<PlaceOutlinedIcon />}
                sx={{ borderColor: 'divider', backgroundColor: 'background.paper' }}
              >
                {location}
              </Button>
            )}
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ alignItems: 'center', px: 1.5, py: 0.5, borderRadius: '10px', border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
            >
              <PaymentsOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} aria-hidden />
              <Typography variant="body2">月租 {formatRent(item.rent)}</Typography>
            </Stack>
          </Stack>
        </Stack>

        <TargetInfo item={item} />

        <Paper variant="outlined" component="section" aria-labelledby="case-content-title" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: '16px' }}>
          <Typography id="case-content-title" variant="h4" component="h2" sx={{ mb: 2 }}>
            事件經過
          </Typography>
          <Typography component="div" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxWidth: '72ch', lineHeight: 1.9 }}>
            {item.content}
          </Typography>
          {item.imageUrls.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" component="h3" sx={{ mb: 1.5 }}>
                證據照片（{item.imageUrls.length}）
              </Typography>
              <ImageGallery images={item.imageUrls} />
            </Box>
          )}
          <Stack direction="row" spacing={1.5} sx={{ mt: 3, flexWrap: 'wrap', rowGap: 1.5 }}>
            <LikeButton target={{ kind: 'case', id: item.id }} initialCount={item.likeCount} />
            <ShareButton title={`${item.title}｜租屋通`} />
          </Stack>
        </Paper>

        <Alert severity="warning" variant="outlined" sx={{ borderRadius: '12px', backgroundColor: 'background.paper' }}>
          本文為網友個人經驗分享，平台未經查證，不代表租屋通立場。若內容涉及不實，請透過粉絲專頁與我們聯繫。
        </Alert>

        <CommentSection target={{ kind: 'case', id: item.id }} initialCount={item.commentCount} />
      </Stack>
    </Container>
  );
}
