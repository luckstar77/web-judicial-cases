import ForumIcon from '@mui/icons-material/Forum';
import GavelIcon from '@mui/icons-material/Gavel';
import { Chip, type ChipProps } from '@mui/material';
import { BRAND_COLORS } from '@/app/theme';
import { SOURCE_LABELS, SOURCE_TYPES, type SourceType } from '@/shared/constants/source';

interface SourceBadgeProps {
  source: SourceType;
  size?: ChipProps['size'];
}

/** 資料來源標章：官方判決（實心主色）vs 網友回報（琥珀色外框）。 */
export function SourceBadge({ source, size = 'small' }: SourceBadgeProps) {
  if (source === SOURCE_TYPES.judgment) {
    return <Chip size={size} color="primary" icon={<GavelIcon />} label={SOURCE_LABELS.judgment} sx={{ fontWeight: 600 }} />;
  }
  return (
    <Chip
      size={size}
      variant="outlined"
      icon={<ForumIcon />}
      label={SOURCE_LABELS.community}
      sx={{
        fontWeight: 600,
        color: BRAND_COLORS.accentDark,
        borderColor: BRAND_COLORS.accent,
        backgroundColor: BRAND_COLORS.accentLight,
        '& .MuiChip-icon': { color: BRAND_COLORS.accentDark },
      }}
    />
  );
}
