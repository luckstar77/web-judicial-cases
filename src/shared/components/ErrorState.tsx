import CloudOffIcon from '@mui/icons-material/CloudOffOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from '@mui/material';
import { getErrorMessage } from '@/shared/api/api-error';
import { EmptyState } from './EmptyState';

interface ErrorStateProps {
  error: unknown;
  title?: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorState({ error, title = '資料載入失敗', onRetry, compact }: ErrorStateProps) {
  return (
    <EmptyState
      compact={compact}
      icon={<CloudOffIcon />}
      title={title}
      description={getErrorMessage(error)}
      action={
        onRetry && (
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRetry}>
            重新載入
          </Button>
        )
      }
    />
  );
}
