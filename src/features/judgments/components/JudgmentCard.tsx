import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { Box, Card, CardActionArea, Divider, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { JudgmentListItem } from '@/shared/api/types';
import { SourceBadge } from '@/shared/components/SourceBadge';
import { buildJudgmentDetailPath } from '@/shared/constants/routes';
import { SOURCE_TYPES } from '@/shared/constants/source';
import { formatCaseNumber } from '@/shared/utils/case-number';
import { formatJudgmentDate } from '@/shared/utils/format-date';
import { formatNumber, formatRent } from '@/shared/utils/format-number';
import { OutcomeChip } from './OutcomeChip';
import { PartyNames } from './PartyNames';

const DEFAULT_TITLE = '租賃糾紛判決';
const UNKNOWN_LOCATION = '地區未標示';

interface JudgmentCardProps {
  judgment: JudgmentListItem;
  keyword?: string;
}

export function JudgmentCard({ judgment, keyword }: JudgmentCardProps) {
  const caseNumber = formatCaseNumber(judgment);
  const location = [judgment.city, judgment.district].filter(Boolean).join(' ') || UNKNOWN_LOCATION;
  return (
    <Card
      component="article"
      sx={{ transition: 'border-color .2s, box-shadow .2s', '&:hover': { borderColor: 'primary.light', boxShadow: '0 4px 16px rgba(14,94,111,0.08)' } }}
    >
      <CardActionArea component={RouterLink} to={buildJudgmentDetailPath(judgment.id, keyword)} sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={1.5}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <SourceBadge source={SOURCE_TYPES.judgment} />
            <Typography variant="caption" color="text.secondary" component="time" dateTime={judgment.jdate}>
              裁判日期 {formatJudgmentDate(judgment.jdate)}
            </Typography>
          </Stack>
          <Box>
            <Typography variant="h4" component="h3" sx={{ fontSize: { xs: '1.0625rem', sm: '1.1875rem' } }}>
              {judgment.jtitle || DEFAULT_TITLE}
            </Typography>
            {caseNumber && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {caseNumber}
              </Typography>
            )}
          </Box>
          <PartyNames judgment={judgment} keyword={keyword} />
          <Stack direction="row" sx={{ flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
            <OutcomeChip judgment={judgment} />
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <PlaceOutlinedIcon sx={{ fontSize: 18 }} aria-hidden />
              <Typography variant="body2">{location}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <PaymentsOutlinedIcon sx={{ fontSize: 18 }} aria-hidden />
              <Typography variant="body2">月租 {formatRent(judgment.rent)}</Typography>
            </Stack>
          </Stack>
          <Divider />
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', color: 'text.secondary' }}>
            <Stack direction="row" spacing={2}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }} aria-label={`${judgment.likeCount} 個讚`}>
                <FavoriteBorderIcon sx={{ fontSize: 18 }} aria-hidden />
                <Typography variant="body2">{formatNumber(judgment.likeCount)}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }} aria-label={`${judgment.commentCount} 則留言`}>
                <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} aria-hidden />
                <Typography variant="body2">{formatNumber(judgment.commentCount)}</Typography>
              </Stack>
            </Stack>
            <Stack direction="row" sx={{ alignItems: 'center', color: 'primary.main' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                查看判決
              </Typography>
              <ChevronRightIcon fontSize="small" aria-hidden />
            </Stack>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
