import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button, Container } from '@mui/material';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { EmptyState } from '@/shared/components/EmptyState';
import { Seo } from '@/shared/components/Seo';
import { NotFoundPage } from './NotFoundPage';

const NOT_FOUND_STATUS = 404;

/** 路由層級錯誤（例如 lazy chunk 載入失敗）。 */
export function RouteErrorPage() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === NOT_FOUND_STATUS) {
    return <NotFoundPage />;
  }
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Seo title="發生錯誤" />
      <EmptyState
        icon={<ErrorOutlineIcon />}
        title="頁面載入失敗"
        description="可能是網站剛更新或網路不穩，請重新整理後再試一次。"
        action={
          <Button variant="contained" onClick={() => window.location.reload()}>
            重新整理
          </Button>
        }
      />
    </Container>
  );
}
