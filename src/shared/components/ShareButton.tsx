import IosShareIcon from '@mui/icons-material/IosShare';
import { Button } from '@mui/material';
import { useSnackbar } from '@/shared/hooks/snackbar-context';

const ABORT_ERROR_NAME = 'AbortError';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  fullWidth?: boolean;
}

/** 優先使用 navigator.share（手機），不支援時複製連結。 */
export function ShareButton({ title, text, url, fullWidth }: ShareButtonProps) {
  const { showMessage } = useSnackbar();

  const handleShare = async () => {
    const shareUrl = url ?? window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === ABORT_ERROR_NAME) {
          return;
        }
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      showMessage('已複製連結，可以貼給朋友了');
    } catch {
      showMessage('無法複製連結，請手動複製網址列', 'warning');
    }
  };

  return (
    <Button
      variant="outlined"
      color="inherit"
      startIcon={<IosShareIcon />}
      onClick={() => void handleShare()}
      fullWidth={fullWidth}
      sx={{ borderColor: 'divider' }}
    >
      分享
    </Button>
  );
}
