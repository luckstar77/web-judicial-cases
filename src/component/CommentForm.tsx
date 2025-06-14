import React, { useState } from 'react';
import { Paper, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addComment } from '../redux/commentSlice';
import { setShowDialog } from '../redux/phoneSlice';
import { USER_DIALOG_STATUS } from '../types/enums';

interface Props {
  filesetId: number;
}

const CommentForm: React.FC<Props> = ({ filesetId }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((s) => s.user.isLoggedIn);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) {
            // 觸發電話登入對話框
            dispatch(setShowDialog(USER_DIALOG_STATUS.PHONE_AUTH));
            return;
        }
        if (!content.trim()) return;
        setLoading(true);
        await dispatch(addComment({ filesetId, content }));
        setLoading(false);
        setContent('');
    };

    if(!isLoggedIn) return(
        <></>
    );

    return (
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>發表留言</Typography>
            <Stack
                component="form"
                spacing={2}
                onSubmit={handleSubmit}
            >
                <TextField
                    label="留言內容"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                    required
                />
                <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={loading}
                    endIcon={<SendIcon />}
                >
          送出
                </LoadingButton>
            </Stack>
        </Paper>
    );
};

export default CommentForm;
