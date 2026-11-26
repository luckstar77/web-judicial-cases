import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, IconButton, Stack, Typography } from '@mui/material';
import { type ChangeEvent, type DragEvent, type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { BRAND_COLORS } from '@/app/theme';
import { IMAGE_LIMITS } from '../constants';

interface ImageDropzoneProps {
  value: File[];
  onChange: (files: File[]) => void;
  error?: string;
}

const BYTES_PER_KB = 1024;
const ACTIVATE_KEYS = ['Enter', ' '];

const formatSize = (bytes: number): string => {
  const kb = bytes / BYTES_PER_KB;
  return kb >= BYTES_PER_KB ? `${(kb / BYTES_PER_KB).toFixed(1)} MB` : `${Math.round(kb)} KB`;
};

const validateFile = (file: File): string | null => {
  if (!IMAGE_LIMITS.acceptedTypes.includes(file.type)) {
    return `「${file.name}」格式不支援（僅限 JPG、PNG、WebP、GIF）`;
  }
  if (file.size > IMAGE_LIMITS.maxSizeBytes) {
    return `「${file.name}」超過 ${IMAGE_LIMITS.maxSizeMb}MB（${formatSize(file.size)}）`;
  }
  return null;
};

/** 拖放 / 點選上傳圖片，前端先檢查張數、大小與格式並顯示預覽。 */
export function ImageDropzone({ value, onChange, error }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [rejections, setRejections] = useState<string[]>([]);
  const previews = useMemo(() => value.map((file) => ({ file, url: URL.createObjectURL(file) })), [value]);

  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews]);

  const addFiles = (incoming: File[]) => {
    const messages: string[] = [];
    const accepted: File[] = [];
    incoming.forEach((file) => {
      const message = validateFile(file);
      if (message) {
        messages.push(message);
        return;
      }
      accepted.push(file);
    });
    const remaining = IMAGE_LIMITS.maxCount - value.length;
    if (accepted.length > remaining) {
      messages.push(`最多 ${IMAGE_LIMITS.maxCount} 張，已略過 ${accepted.length - Math.max(remaining, 0)} 張`);
    }
    setRejections(messages);
    const next = [...value, ...accepted.slice(0, Math.max(remaining, 0))];
    if (next.length !== value.length) {
      onChange(next);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (ACTIVATE_KEYS.includes(event.key)) {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, fileIndex) => fileIndex !== index));
    setRejections([]);
  };

  const isFull = value.length >= IMAGE_LIMITS.maxCount;

  return (
    <Stack spacing={2}>
      <Box
        role="button"
        tabIndex={isFull ? -1 : 0}
        aria-disabled={isFull}
        aria-label="上傳證據照片"
        onClick={() => !isFull && inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        sx={{
          border: `2px dashed ${dragging ? BRAND_COLORS.primary : error ? BRAND_COLORS.error : BRAND_COLORS.border}`,
          borderRadius: '16px',
          p: { xs: 3, md: 4 },
          textAlign: 'center',
          cursor: isFull ? 'not-allowed' : 'pointer',
          backgroundColor: dragging ? BRAND_COLORS.primaryLight : BRAND_COLORS.background,
          opacity: isFull ? 0.6 : 1,
          transition: 'background-color .15s, border-color .15s',
          '&:focus-visible': { outline: `3px solid ${BRAND_COLORS.primary}`, outlineOffset: 2 },
        }}
      >
        <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} aria-hidden />
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          {isFull ? '已達上限' : '拖曳圖片到這裡，或點選選擇檔案'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          最多 {IMAGE_LIMITS.maxCount} 張，每張 ≤ {IMAGE_LIMITS.maxSizeMb}MB，支援 JPG / PNG / WebP / GIF（{value.length}/{IMAGE_LIMITS.maxCount}）
        </Typography>
        <input ref={inputRef} type="file" accept={IMAGE_LIMITS.acceptAttribute} multiple hidden onChange={handleInputChange} data-testid="image-input" />
      </Box>
      {rejections.length > 0 && (
        <Alert severity="warning" onClose={() => setRejections([])}>
          {rejections.map((message) => (
            <div key={message}>{message}</div>
          ))}
        </Alert>
      )}
      {error && (
        <Typography variant="body2" color="error" role="alert">
          {error}
        </Typography>
      )}
      {previews.length > 0 && (
        <Box
          component="ul"
          sx={{
            listStyle: 'none',
            m: 0,
            p: 0,
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: 'repeat(3, minmax(0, 1fr))', sm: 'repeat(5, minmax(0, 1fr))' },
          }}
        >
          {previews.map((preview, index) => (
            <Box
              component="li"
              key={preview.url}
              sx={{ position: 'relative', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${BRAND_COLORS.border}` }}
            >
              <Box component="img" src={preview.url} alt={preview.file.name} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <IconButton
                size="small"
                aria-label={`移除 ${preview.file.name}`}
                onClick={() => removeAt(index)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: 'rgba(26,32,39,0.6)',
                  color: '#fff',
                  '&:hover': { backgroundColor: 'rgba(26,32,39,0.8)' },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Stack>
  );
}
