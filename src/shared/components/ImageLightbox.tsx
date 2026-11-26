import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, IconButton, Typography } from '@mui/material';
import { useEffect } from 'react';

interface ImageLightboxProps {
  images: string[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  altPrefix?: string;
}

const KEY_PREV = 'ArrowLeft';
const KEY_NEXT = 'ArrowRight';
const CONTROL_BG = 'rgba(0,0,0,0.45)';

export function ImageLightbox({ images, index, onClose, onIndexChange, altPrefix = '證據照片' }: ImageLightboxProps) {
  const open = index !== null && images.length > 0;
  const total = images.length;

  useEffect(() => {
    if (!open || index === null) {
      return undefined;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEY_PREV) {
        onIndexChange((index - 1 + total) % total);
      }
      if (event.key === KEY_NEXT) {
        onIndexChange((index + 1) % total);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, index, total, onIndexChange]);

  if (!open || index === null) {
    return null;
  }

  const controlSx = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', color: '#fff', backgroundColor: CONTROL_BG } as const;

  return (
    <Dialog open onClose={onClose} fullScreen PaperProps={{ sx: { backgroundColor: 'rgba(10,16,20,0.94)', borderRadius: 0 } }} aria-label="圖片檢視">
      <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'grid', placeItems: 'center', p: { xs: 1, md: 6 } }}>
        <Box
          component="img"
          src={images[index]}
          alt={`${altPrefix} ${index + 1}`}
          sx={{ maxWidth: '100%', maxHeight: 'calc(100vh - 96px)', objectFit: 'contain', borderRadius: '8px' }}
        />
        <IconButton aria-label="關閉" onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16, color: '#fff', backgroundColor: CONTROL_BG }}>
          <CloseIcon />
        </IconButton>
        {total > 1 && (
          <>
            <IconButton aria-label="上一張" onClick={() => onIndexChange((index - 1 + total) % total)} sx={{ ...controlSx, left: 16 }}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton aria-label="下一張" onClick={() => onIndexChange((index + 1) % total)} sx={{ ...controlSx, right: 16 }}>
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}
        <Typography variant="body2" sx={{ position: 'absolute', bottom: 20, color: '#fff' }} aria-live="polite">
          {index + 1} / {total}
        </Typography>
      </Box>
    </Dialog>
  );
}
