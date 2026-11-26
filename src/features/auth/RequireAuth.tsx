import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Button } from '@mui/material';
import { type ReactNode, useEffect } from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { useAuth } from './auth-context';

interface RequireAuthProps {
  children: ReactNode;
  reason?: string;
}

/** 未登入時顯示提示並自動開啟登入視窗；登入後直接渲染內容。 */
export function RequireAuth({ children, reason = '登入後即可使用此功能' }: RequireAuthProps) {
  const { isAuthenticated, openAuthDialog } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthDialog({ reason });
    }
  }, [isAuthenticated, openAuthDialog, reason]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', py: { xs: 2, md: 4 } }}>
      <EmptyState
        icon={<LockOutlinedIcon />}
        title="請先登入"
        description={reason}
        action={
          <Button variant="contained" onClick={() => openAuthDialog({ reason })}>
            登入 / 註冊
          </Button>
        }
      />
    </Box>
  );
}
