import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Box,
    Button,
    Snackbar,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { uploadCase, resetStatus } from '../redux/uploadSlice';
import { setShowDialog } from '../redux/phoneSlice';
import { USER_DIALOG_STATUS } from '../types/enums';

export interface UploadCasePageProps {
    onComplete?: () => void;
}

export default function UploadCasePage({ onComplete }: UploadCasePageProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status, error } = useAppSelector((s) => s.upload);
    const isLoggedIn = useAppSelector((s) => s.user.isLoggedIn);

    const [form, setForm] = useState<{
        title: string;
        content: string;
        defendantName: string;
        defendantPhone: string;
        defendantIdNo: string;
        images: File[];
    }>({
        title: '',
        content: '',
        defendantName: '',
        defendantPhone: '',
        defendantIdNo: '',
        images: [],
    });

    const handleChange =
        (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            if (key === 'images' && e.target.files) {
                setForm({ ...form, images: Array.from(e.target.files) });
            } else {
                setForm({ ...form, [key]: e.target.value });
            }
        };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) {
            dispatch(setShowDialog(USER_DIALOG_STATUS.PHONE_AUTH));
            return;
        }
        dispatch(uploadCase(form));
    };

    const handleClose = () => {
        if (status === 'succeeded' && onComplete) {
            onComplete();
        }
        dispatch(resetStatus());
    };

    const handleBack = () => {
        if (onComplete) {
            onComplete();
        } else {
            navigate(-1);
        }
    };

    return (
        <Container sx={{ py: 4 }}>
            <Button variant="outlined" sx={{ mb: 2 }} onClick={handleBack}>
                回到討論區
            </Button>
            <Typography variant="h4" gutterBottom>
                上傳案例
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 600,
                }}
            >
                <TextField
                    label="標題"
                    value={form.title}
                    onChange={handleChange('title')}
                    required
                />
                <TextField
                    label="內容"
                    value={form.content}
                    onChange={handleChange('content')}
                    multiline
                    rows={4}
                    required
                />
                <TextField
                    label="被告姓名"
                    value={form.defendantName}
                    onChange={handleChange('defendantName')}
                    required
                />
                <TextField
                    label="被告電話"
                    value={form.defendantPhone}
                    onChange={handleChange('defendantPhone')}
                    required
                />
                <TextField
                    label="被告身分證字號"
                    value={form.defendantIdNo}
                    onChange={handleChange('defendantIdNo')}
                    required
                />
                <Button variant="contained" component="label">
                    上傳圖片
                    <input
                        hidden
                        multiple
                        type="file"
                        accept="image/*"
                        onChange={handleChange('images')}
                    />
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={status === 'loading'}
                >
                    送出
                </Button>
            </Box>
            <Snackbar
                open={status === 'succeeded'}
                autoHideDuration={2000}
                onClose={handleClose}
            >
                <Alert severity="success" onClose={handleClose} sx={{ width: '100%' }}>
                    上傳成功
                </Alert>
            </Snackbar>
            <Snackbar
                open={status === 'failed'}
                autoHideDuration={2000}
                onClose={handleClose}
            >
                <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
}
