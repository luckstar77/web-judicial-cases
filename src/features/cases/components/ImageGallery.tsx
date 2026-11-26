import { Box, ButtonBase } from '@mui/material';
import { useState } from 'react';
import { BRAND_COLORS } from '@/app/theme';
import { ImageLightbox } from '@/shared/components/ImageLightbox';

export function ImageGallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number | null>(null);
  if (images.length === 0) {
    return null;
  }
  return (
    <>
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' } }}>
        {images.map((url, imageIndex) => (
          <ButtonBase
            key={url}
            onClick={() => setIndex(imageIndex)}
            aria-label={`放大檢視證據照片 ${imageIndex + 1}`}
            sx={{
              aspectRatio: '4 / 3',
              borderRadius: '12px',
              overflow: 'hidden',
              border: `1px solid ${BRAND_COLORS.border}`,
              backgroundColor: BRAND_COLORS.background,
            }}
          >
            <Box
              component="img"
              src={url}
              alt={`證據照片 ${imageIndex + 1}`}
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </ButtonBase>
        ))}
      </Box>
      <ImageLightbox images={images} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </>
  );
}
