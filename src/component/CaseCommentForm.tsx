import React, { useState } from 'react';
import { Paper, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addCaseComment, fetchCaseComments } from '../redux/caseCommentSlice';
import { setShowDialog } from '../redux/phoneSlice';
import { USER_DIALOG_STATUS } from '../types/enums';

interface Props {
    caseId: number;
}

const CaseCommentForm: React.FC<Props> = ({ caseId }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((s) => s.user.isLoggedIn);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
            dispatch(setShowDialog(USER_DIALOG_STATUS.LOGIN));
            return;
        }
        if (!content.trim()) return;
        setLoading(true);
        await dispatch(addCaseComment({ caseId, content }));
        await dispatch(fetchCaseComments(caseId));
        setLoading(false);
        setContent('');
    };

    if (!isLoggedIn) return <></>;

    return (
        <Paper
            elevation={1}
            sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}
            onClick={(e) => e.stopPropagation()}
        >
            <Typography variant="h6" gutterBottom>
                發表留言
            </Typography>
            <Stack
                component="form"
                spacing={2}
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
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

export default CaseCommentForm;
