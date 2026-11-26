import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Box, Chip, FormControl, InputLabel, MenuItem, Paper, Select, Skeleton, Slider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND_COLORS } from '@/app/theme';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { buildJudgmentSearchPath } from '@/shared/constants/routes';
import { TAIWAN_CITIES } from '@/shared/constants/taiwan-districts';
import { formatNumber } from '@/shared/utils/format-number';
import { MIN_COUNT_OPTIONS, RENT_SLIDER, WARNING_DEFAULTS } from '../constants';
import { useCityStats, useWarningNames } from '../hooks';

const TaiwanRiskMap = lazy(() => import('./TaiwanRiskMap').then((module) => ({ default: module.TaiwanRiskMap })));

const CHIP_SKELETON_COUNT = 12;
const READING_TIPS = [
  '名單取自判決中的「敗訴方」姓名，依敗訴次數由多到少排列。',
  '匿名（含「○」）或過長的名稱不會列入。',
  '同名同姓者眾，請點進判決核對地區、租金與內容。',
];
const TEN_THOUSAND = 10_000;
type RentRange = [number, number];

const formatRentMark = (value: number): string => {
  if (value >= RENT_SLIDER.max) {
    return `${RENT_SLIDER.max / TEN_THOUSAND} 萬元以上`;
  }
  return `${formatNumber(value)} 元`;
};

const toRentMax = (sliderValue: number): number => (sliderValue >= RENT_SLIDER.max ? WARNING_DEFAULTS.rentMax : sliderValue);

function WarningNameChips({ city, rentRange, minCount }: { city: string; rentRange: RentRange; minCount: number }) {
  const navigate = useNavigate();
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useWarningNames({
    city,
    rentMin: rentRange[0],
    rentMax: toRentMax(rentRange[1]),
    minCount,
  });

  if (isPending) {
    return (
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }} aria-busy="true" aria-label="名單載入中">
        {Array.from({ length: CHIP_SKELETON_COUNT }, (_, index) => (
          <Skeleton key={index} variant="rounded" width={88} height={32} />
        ))}
      </Stack>
    );
  }
  if (isError) {
    return <ErrorState compact error={error} onRetry={() => void refetch()} />;
  }
  if (data.length === 0) {
    return <EmptyState compact icon={<PersonSearchOutlinedIcon />} title="此條件下沒有符合的名單" description="試著放寬租金範圍或降低判決次數門檻。" />;
  }
  return (
    <Box sx={{ opacity: isPlaceholderData ? 0.6 : 1, transition: 'opacity .2s' }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        共 {formatNumber(data.length)} 位，點選姓名即可查詢相關判決
      </Typography>
      <Stack component="ul" direction="row" sx={{ flexWrap: 'wrap', gap: 1, m: 0, p: 0, listStyle: 'none', maxHeight: 280, overflowY: 'auto' }}>
        {data.map((item) => (
          <li key={item.name}>
            <Chip
              clickable
              onClick={() => navigate(buildJudgmentSearchPath(item.name))}
              label={
                <span>
                  {item.name}
                  <Box component="span" sx={{ ml: 0.75, color: BRAND_COLORS.accentDark, fontWeight: 700 }}>
                    ×{item.judgmentCount}
                  </Box>
                </span>
              }
              aria-label={`${item.name}，敗訴 ${item.judgmentCount} 件，查詢判決`}
              sx={{ backgroundColor: BRAND_COLORS.paper, border: `1px solid ${BRAND_COLORS.border}`, '&:hover': { borderColor: BRAND_COLORS.accent } }}
            />
          </li>
        ))}
      </Stack>
    </Box>
  );
}

function RiskMapPanel({ city, onSelectCity }: { city: string; onSelectCity: (city: string) => void }) {
  const { data, isPending, isError } = useCityStats();
  if (isPending) {
    return <Skeleton variant="rounded" height={360} />;
  }
  if (isError) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
        地圖暫時無法載入
      </Typography>
    );
  }
  return (
    <Suspense fallback={<Skeleton variant="rounded" height={360} />}>
      <TaiwanRiskMap stats={data} selectedCity={city} onSelectCity={onSelectCity} />
    </Suspense>
  );
}

/** 首頁「高風險名單」：縣市判決數地圖 + 篩選 + 敗訴次數名單。 */
export function RiskSection() {
  const [city, setCity] = useState<string>(WARNING_DEFAULTS.city);
  const [rentDraft, setRentDraft] = useState<RentRange>([RENT_SLIDER.min, RENT_SLIDER.max]);
  const [rentRange, setRentRange] = useState<RentRange>([RENT_SLIDER.min, RENT_SLIDER.max]);
  const [minCount, setMinCount] = useState<number>(WARNING_DEFAULTS.minCount);

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: '20px' }}>
      <Grid container spacing={{ xs: 3, md: 5 }}>
        <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 2, md: 1 } }}>
          <RiskMapPanel city={city} onSelectCity={setCity} />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 1, md: 2 } }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="risk-city-label">縣市</InputLabel>
                <Select labelId="risk-city-label" label="縣市" value={city} onChange={(event) => setCity(event.target.value)}>
                  {TAIWAN_CITIES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="risk-min-count-label">敗訴次數</InputLabel>
                <Select labelId="risk-min-count-label" label="敗訴次數" value={minCount} onChange={(event) => setMinCount(Number(event.target.value))}>
                  {MIN_COUNT_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option} 次以上
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Box sx={{ px: 1 }}>
              <Typography id="risk-rent-label" variant="body2" color="text.secondary" gutterBottom>
                月租金範圍：{formatRentMark(rentDraft[0])} – {formatRentMark(rentDraft[1])}
              </Typography>
              <Slider
                aria-labelledby="risk-rent-label"
                getAriaValueText={formatRentMark}
                value={rentDraft}
                min={RENT_SLIDER.min}
                max={RENT_SLIDER.max}
                step={RENT_SLIDER.step}
                disableSwap
                onChange={(_event, value) => setRentDraft(value as RentRange)}
                onChangeCommitted={(_event, value) => setRentRange(value as RentRange)}
                valueLabelDisplay="auto"
                valueLabelFormat={formatRentMark}
              />
            </Box>
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                <WarningAmberRoundedIcon sx={{ color: BRAND_COLORS.accentDark }} aria-hidden />
                <Typography variant="h5" component="h3">
                  {city}敗訴名單
                </Typography>
              </Stack>
              <WarningNameChips city={city} rentRange={rentRange} minCount={minCount} />
            </Box>
            <Box sx={{ p: 2, borderRadius: '12px', backgroundColor: BRAND_COLORS.background, border: `1px solid ${BRAND_COLORS.border}` }}>
              <Typography variant="subtitle2" component="h4" sx={{ mb: 0.75 }}>
                如何解讀這份名單？
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { typography: 'body2', color: 'text.secondary', mb: 0.25 } }}>
                {READING_TIPS.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}
