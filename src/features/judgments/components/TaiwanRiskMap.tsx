import { Box, Stack, Typography } from '@mui/material';
import { type KeyboardEvent, useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { BRAND_COLORS } from '@/app/theme';
import taiwanTopology from '@/asset/taiwan-counties.topo.json';
import type { CityStat } from '@/shared/api/types';
import { toCaseCity, toMapCountyName, toMapCountyNames } from '@/shared/utils/city-name';
import { formatNumber } from '@/shared/utils/format-number';

/** 由淺到深的主色階（5 級）。 */
const COLOR_SCALE = ['#E3EFF1', '#B4D3DA', '#7FB1BD', '#3F8796', '#0E5E6F'] as const;
const EMPTY_FILL = '#EEF0F2';
const HOVER_FILL = BRAND_COLORS.accent;
const MAP_WIDTH = 360;
const MAP_HEIGHT = 440;
const PROJECTION_CONFIG = { center: [120.25, 24.15] as [number, number], scale: 4800 };
const ACTIVATE_KEYS = ['Enter', ' '];

interface GeographyProperties {
  name: string;
}

interface TaiwanRiskMapProps {
  stats: CityStat[];
  /** 縣市清單格式（例：`台北市`） */
  selectedCity?: string;
  onSelectCity: (caseCity: string) => void;
}

const getColor = (count: number, max: number): string => {
  if (count <= 0 || max <= 0) {
    return EMPTY_FILL;
  }
  const level = Math.min(COLOR_SCALE.length - 1, Math.floor((count / max) * COLOR_SCALE.length));
  return COLOR_SCALE[level];
};

/** 各縣市判決數 choropleth；點選縣市會切換高風險名單的篩選。 */
export function TaiwanRiskMap({ stats, selectedCity, onSelectCity }: TaiwanRiskMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const countByCounty = useMemo(() => {
    const map = new Map<string, number>();
    stats.forEach((stat) => {
      toMapCountyNames(stat.city).forEach((county) => map.set(county, (map.get(county) ?? 0) + stat.judgmentCount));
    });
    return map;
  }, [stats]);

  const maxCount = useMemo(() => Math.max(0, ...countByCounty.values()), [countByCounty]);
  const selectedCounty = selectedCity ? toMapCountyName(selectedCity) : undefined;
  const focusCounty = hovered ?? selectedCounty;

  const select = (county: string) => {
    const caseCity = toCaseCity(county);
    if (caseCity) {
      onSelectCity(caseCity);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<SVGPathElement>, county: string) => {
    if (!ACTIVATE_KEYS.includes(event.key)) {
      return;
    }
    event.preventDefault();
    select(county);
  };

  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: MAP_WIDTH, '& svg': { display: 'block', width: '100%', height: 'auto' } }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={PROJECTION_CONFIG}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          aria-label="臺灣各縣市租賃判決數地圖"
        >
          <Geographies geography={taiwanTopology}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const county = (geo.properties as GeographyProperties).name;
                const count = countByCounty.get(county) ?? 0;
                const isSelected = county === selectedCounty;
                const fill = getColor(count, maxCount);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={0}
                    role="button"
                    aria-label={`${county}，判決 ${count} 件`}
                    aria-pressed={isSelected}
                    onMouseEnter={() => setHovered(county)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(county)}
                    onBlur={() => setHovered(null)}
                    onClick={() => select(county)}
                    onKeyDown={(event) => handleKeyDown(event, county)}
                    style={{
                      default: {
                        fill,
                        stroke: isSelected ? BRAND_COLORS.accentDark : '#FFFFFF',
                        strokeWidth: isSelected ? 1.6 : 0.6,
                        outline: 'none',
                        cursor: 'pointer',
                        transition: 'fill .15s',
                      },
                      hover: { fill: HOVER_FILL, stroke: '#FFFFFF', strokeWidth: 0.8, outline: 'none', cursor: 'pointer' },
                      pressed: { fill: BRAND_COLORS.accentDark, outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </Box>
      <Typography variant="body2" color="text.secondary" aria-live="polite" sx={{ minHeight: 24 }}>
        {focusCounty ? (
          <>
            <strong>{focusCounty}</strong>：判決 {formatNumber(countByCounty.get(focusCounty) ?? 0)} 件
          </>
        ) : (
          '點選縣市即可切換名單'
        )}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} aria-hidden>
        <Typography variant="caption" color="text.secondary">
          少
        </Typography>
        {COLOR_SCALE.map((color) => (
          <Box key={color} sx={{ width: 24, height: 10, borderRadius: '4px', backgroundColor: color }} />
        ))}
        <Typography variant="caption" color="text.secondary">
          多
        </Typography>
      </Stack>
    </Stack>
  );
}
