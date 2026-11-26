import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, InputAdornment, TextField } from '@mui/material';
import { type FormEvent, type ReactNode, useEffect, useState } from 'react';

interface SearchFieldProps {
  defaultValue?: string;
  placeholder: string;
  label: string;
  buttonLabel?: string;
  size?: 'medium' | 'large';
  startIcon?: ReactNode;
  helperText?: ReactNode;
  onSubmit: (keyword: string) => void;
}

/** 搜尋框 + 搜尋按鈕；空白關鍵字不送出。 */
export function SearchField({
  defaultValue = '',
  placeholder,
  label,
  buttonLabel = '搜尋',
  size = 'medium',
  startIcon,
  helperText,
  onSubmit,
}: SearchFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const isLarge = size === 'large';

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keyword = value.trim();
    if (!keyword) {
      return;
    }
    onSubmit(keyword);
  };

  return (
    <Box component="form" role="search" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', width: '100%' }}>
      <TextField
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        helperText={helperText}
        slotProps={{
          htmlInput: { 'aria-label': label, enterKeyHint: 'search' },
          input: {
            startAdornment: <InputAdornment position="start">{startIcon ?? <SearchIcon color="action" />}</InputAdornment>,
            sx: isLarge ? { height: 56, fontSize: '1.0625rem', borderRadius: '12px' } : undefined,
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        sx={{ flexShrink: 0, height: 56, px: isLarge ? 3.5 : 3, borderRadius: isLarge ? '12px' : undefined }}
      >
        {buttonLabel}
      </Button>
    </Box>
  );
}
