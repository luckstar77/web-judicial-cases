import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import GavelIcon from '@mui/icons-material/Gavel';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Container, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND_COLORS } from '@/app/theme';
import { useAuth } from '@/features/auth/auth-context';
import { useCommunitySearch } from '@/features/cases/use-community-search';
import { SearchField } from '@/shared/components/SearchField';
import { buildJudgmentSearchPath } from '@/shared/constants/routes';
import { StatChips } from './StatChips';

const SEARCH_MODES = {
  judgment: 'judgment',
  community: 'community',
} as const;

type SearchMode = (typeof SEARCH_MODES)[keyof typeof SEARCH_MODES];

const HERO_BACKGROUND = [
  'radial-gradient(1200px 400px at 85% -10%, rgba(233,162,59,0.28), transparent 60%)',
  `linear-gradient(160deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%)`,
].join(', ');

const MODE_CONFIG: Record<SearchMode, { placeholder: string; label: string; helper: string }> = {
  judgment: {
    placeholder: '輸入房東或房客姓名',
    label: '輸入姓名查詢判決',
    helper: '比對公開法院判決中的原告或被告姓名',
  },
  community: {
    placeholder: '輸入姓名、電話或身分證',
    label: '輸入姓名、電話或身分證查詢網友回報',
    helper: '需登入，僅顯示完全相符的網友回報',
  },
};

/** 首頁主視覺：判決書 / 網友回報 分段搜尋。 */
export function SearchHero() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const searchCommunity = useCommunitySearch();
  const [mode, setMode] = useState<SearchMode>(SEARCH_MODES.judgment);
  const config = MODE_CONFIG[mode];

  const handleSubmit = (keyword: string) => {
    if (mode === SEARCH_MODES.judgment) {
      navigate(buildJudgmentSearchPath(keyword));
      return;
    }
    searchCommunity(keyword);
  };

  return (
    <Box
      component="section"
      aria-labelledby="hero-title"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
        background: HERO_BACKGROUND,
      }}
    >
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 }, position: 'relative' }}>
        <Stack spacing={{ xs: 3, md: 4 }} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
            <Typography id="hero-title" variant="h1" sx={{ fontSize: { xs: '2rem', md: '3rem' }, letterSpacing: '0.04em' }}>
              租屋前，先查一下
            </Typography>
            <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: 'rgba(255,255,255,0.86)', maxWidth: 640 }}>
              輸入房東或房客姓名，查詢租賃糾紛判決與網友回報，簽約前多一分安心。
            </Typography>
          </Stack>
          <Paper elevation={0} sx={{ width: '100%', p: { xs: 2, md: 2.5 }, borderRadius: '20px', boxShadow: '0 20px 48px rgba(5,30,36,0.32)' }}>
            <Stack spacing={2}>
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={mode}
                onChange={(_event, value: SearchMode | null) => value && setMode(value)}
                aria-label="搜尋類型"
                sx={{
                  backgroundColor: BRAND_COLORS.background,
                  borderRadius: '12px',
                  p: 0.5,
                  '& .MuiToggleButton-root': { border: 0, borderRadius: '10px !important', py: 1, fontWeight: 600, color: 'text.secondary', gap: 0.75 },
                  '& .Mui-selected': { backgroundColor: '#fff !important', color: 'primary.main', boxShadow: '0 1px 3px rgba(26,32,39,0.12)' },
                }}
              >
                <ToggleButton value={SEARCH_MODES.judgment}>
                  <GavelIcon fontSize="small" aria-hidden />
                  判決書
                </ToggleButton>
                <ToggleButton value={SEARCH_MODES.community}>
                  <ForumOutlinedIcon fontSize="small" aria-hidden />
                  網友回報
                  {!isAuthenticated && <LockOutlinedIcon sx={{ fontSize: 16 }} aria-label="需登入" />}
                </ToggleButton>
              </ToggleButtonGroup>
              <SearchField key={mode} size="large" label={config.label} placeholder={config.placeholder} buttonLabel="查詢" onSubmit={handleSubmit} />
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left', px: 0.5 }}>
                {config.helper}
              </Typography>
            </Stack>
          </Paper>
          <StatChips />
        </Stack>
      </Container>
    </Box>
  );
}
