import SendIcon from '@mui/icons-material/Send';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { type FormEvent, useState } from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { getErrorMessage } from '@/shared/api/api-error';
import { useSnackbar } from '@/shared/hooks/snackbar-context';
import { useCreateComment } from '../hooks';
import { COMMENT_MAX_LENGTH, type EngagementTarget } from '../types';

interface CommentFormProps {
  target: EngagementTarget;
  placeholder?: string;
}

export function CommentForm({ target, placeholder = '分享你的經驗或補充資訊（請理性發言、勿人身攻擊）' }: CommentFormProps) {
  const { isAuthenticated, openAuthDialog } = useAuth();
  const { showMessage } = useSnackbar();
  const [content, setContent] = useState('');
  const mutation = useCreateComment(target);
  const trimmed = content.trim();
  const tooLong = content.length > COMMENT_MAX_LENGTH;

  if (!isAuthenticated) {
    return (
      <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">
          登入後即可留言，分享你的租屋經驗
        </Typography>
        <Button variant="contained" onClick={() => openAuthDialog({ reason: '登入後即可留言' })}>
          登入留言
        </Button>
      </Paper>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmed || tooLong) {
      return;
    }
    mutation.mutate(trimmed, {
      onSuccess: () => {
        setContent('');
        showMessage('留言已送出');
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={1.5}>
        <TextField
          label="留言"
          multiline
          minRows={3}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={placeholder}
          error={tooLong}
          helperText={`${content.length} / ${COMMENT_MAX_LENGTH}`}
          slotProps={{ formHelperText: { sx: { textAlign: 'right', mx: 0 } } }}
        />
        {mutation.isError && <Alert severity="error">{getErrorMessage(mutation.error)}</Alert>}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={!trimmed || tooLong || mutation.isPending}>
            {mutation.isPending ? '送出中…' : '送出留言'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
