import { Box, Chip, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { getDistricts, TAIWAN_CITIES } from '@/shared/constants/taiwan-districts';
import { POPULAR_CITIES } from '../constants';

export interface CaseFilterValue {
  city?: string;
  district?: string;
}

interface CaseFiltersProps {
  value: CaseFilterValue;
  onChange: (value: CaseFilterValue) => void;
}

const ALL_OPTION = '';

export function CaseFilters({ value, onChange }: CaseFiltersProps) {
  const districts = value.city ? getDistricts(value.city) : [];
  const chipCities = value.city && !POPULAR_CITIES.some((city) => city === value.city) ? [...POPULAR_CITIES, value.city] : POPULAR_CITIES;

  return (
    <Stack spacing={2}>
      <Box
        role="group"
        aria-label="快速選擇縣市"
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 0.5,
          mx: { xs: -2, sm: 0 },
          px: { xs: 2, sm: 0 },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Chip
          label="全部縣市"
          color={value.city ? 'default' : 'primary'}
          variant={value.city ? 'outlined' : 'filled'}
          onClick={() => onChange({})}
          sx={{ flexShrink: 0 }}
        />
        {chipCities.map((city) => {
          const selected = value.city === city;
          return (
            <Chip
              key={city}
              label={city}
              color={selected ? 'primary' : 'default'}
              variant={selected ? 'filled' : 'outlined'}
              onClick={() => onChange({ city })}
              aria-pressed={selected}
              sx={{ flexShrink: 0, backgroundColor: selected ? undefined : 'background.paper' }}
            />
          );
        })}
      </Box>
      <Stack direction="row" spacing={1.5}>
        <FormControl size="small" sx={{ flex: 1, maxWidth: { sm: 220 } }}>
          <InputLabel id="case-city-label">縣市</InputLabel>
          <Select
            labelId="case-city-label"
            label="縣市"
            value={value.city ?? ALL_OPTION}
            onChange={(event) => onChange(event.target.value ? { city: event.target.value } : {})}
          >
            <MenuItem value={ALL_OPTION}>全部縣市</MenuItem>
            {TAIWAN_CITIES.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ flex: 1, maxWidth: { sm: 220 } }} disabled={!value.city}>
          <InputLabel id="case-district-label">行政區</InputLabel>
          <Select
            labelId="case-district-label"
            label="行政區"
            value={value.district ?? ALL_OPTION}
            onChange={(event) => onChange({ city: value.city, district: event.target.value || undefined })}
          >
            <MenuItem value={ALL_OPTION}>全部行政區</MenuItem>
            {districts.map((district) => (
              <MenuItem key={district} value={district}>
                {district}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
}
