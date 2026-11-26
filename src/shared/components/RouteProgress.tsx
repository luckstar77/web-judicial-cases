import { LinearProgress } from '@mui/material';
import { useNavigation } from 'react-router-dom';

const IDLE_STATE = 'idle';

/** 切換頁面（lazy route 載入中）時顯示頂部進度條，取代全螢幕 loading。 */
export function RouteProgress() {
  const navigation = useNavigation();
  if (navigation.state === IDLE_STATE) {
    return null;
  }
  return (
    <LinearProgress
      color="secondary"
      aria-label="頁面載入中"
      sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: (theme) => theme.zIndex.appBar + 1, height: 3 }}
    />
  );
}
