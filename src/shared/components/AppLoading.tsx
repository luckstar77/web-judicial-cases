import { Box, LinearProgress } from '@mui/material';

/** 首次載入 lazy route 時的極簡占位（頂部進度條，不遮蔽畫面）。 */
export function AppLoading() {
  return (
    <Box sx={{ minHeight: '100dvh' }} aria-busy="true" aria-label="載入中">
      <LinearProgress color="secondary" sx={{ height: 3 }} />
    </Box>
  );
}
