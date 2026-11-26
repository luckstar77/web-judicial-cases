import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { Box, Card, CardActionArea, Divider, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { BRAND_COLORS } from '@/app/theme';
import type { CaseListItem } from '@/shared/api/types';
import { SourceBadge } from '@/shared/components/SourceBadge';
import { buildCaseDetailPath } from '@/shared/constants/routes';
import { SOURCE_TYPES } from '@/shared/constants/source';
import { formatRelativeTime } from '@/shared/utils/format-date';
import { formatNumber, formatRent } from '@/shared/utils/format-number';

const MAX_THUMBNAILS = 3;
const ANONYMOUS_AUTHOR = '匿名網友';
const UNKNOWN_LOCATION = '地區未提供';
const WHITESPACE_PATTERN = /\s+/g;

const lineClamp = (lines: number) =>
  ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }) as const;

export function CaseCard({ item }: { item: CaseListItem }) {
  const location = [item.location, item.district].filter(Boolean).join(' ') || UNKNOWN_LOCATION;
  const thumbnails = item.imageUrls.slice(0, MAX_THUMBNAILS);
  const extraImages = item.imageUrls.length - thumbnails.length;

  return (
    <Card
      component="article"
      sx={{
        height: '100%',
        transition: 'border-color .2s, box-shadow .2s',
        '&:hover': { borderColor: BRAND_COLORS.accent, boxShadow: '0 4px 16px rgba(154,91,0,0.08)' },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={buildCaseDetailPath(item.id)}
        sx={{ height: '100%', p: { xs: 2, sm: 2.5 }, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start' }}
      >
        <Stack spacing={1.5} sx={{ flex: 1 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <SourceBadge source={SOURCE_TYPES.community} />
            <Typography variant="caption" color="text.secondary" component="time" dateTime={item.createdAt}>
              {formatRelativeTime(item.createdAt)}
            </Typography>
          </Stack>
          <Typography variant="h4" component="h3" sx={{ fontSize: { xs: '1.0625rem', sm: '1.125rem' }, ...lineClamp(2) }}>
            {item.title}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap', columnGap: 2, rowGap: 0.5, color: 'text.secondary' }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <PersonOutlineIcon sx={{ fontSize: 18 }} aria-hidden />
              <Typography variant="body2">
                對象：<strong>{item.defendantName}</strong>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <PlaceOutlinedIcon sx={{ fontSize: 18 }} aria-hidden />
              <Typography variant="body2">{location}</Typography>
            </Stack>
            <Typography variant="body2">月租 {formatRent(item.rent)}</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={lineClamp(3)}>
            {item.content.replace(WHITESPACE_PATTERN, ' ')}
          </Typography>
          {thumbnails.length > 0 && (
            <Stack direction="row" spacing={1} aria-label={`${item.imageUrls.length} 張證據照片`}>
              {thumbnails.map((url, index) => (
                <Box
                  key={url}
                  sx={{
                    position: 'relative',
                    width: 72,
                    height: 72,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: BRAND_COLORS.background,
                    flexShrink: 0,
                  }}
                >
                  <Box component="img" src={url} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {index === thumbnails.length - 1 && extraImages > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor: 'rgba(26,32,39,0.55)',
                        color: '#fff',
                        fontWeight: 700,
                      }}
                    >
                      +{extraImages}
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
        <Divider sx={{ my: 1.5 }} />
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', color: 'text.secondary' }}>
          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }} aria-label={`${item.likeCount} 個讚`}>
              <FavoriteBorderIcon sx={{ fontSize: 18 }} aria-hidden />
              <Typography variant="body2">{formatNumber(item.likeCount)}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }} aria-label={`${item.commentCount} 則留言`}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} aria-hidden />
              <Typography variant="body2">{formatNumber(item.commentCount)}</Typography>
            </Stack>
            {item.imageUrls.length > 0 && (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }} aria-hidden>
                <PhotoLibraryOutlinedIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{item.imageUrls.length}</Typography>
              </Stack>
            )}
          </Stack>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: '45%' }}>
            {item.authorDisplayName || ANONYMOUS_AUTHOR}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
