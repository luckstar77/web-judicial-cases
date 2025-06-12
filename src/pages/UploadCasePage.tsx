import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Box,
    Button,
    MenuItem,
    Snackbar,
    Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { uploadCase, resetStatus } from '../redux/uploadSlice';
import { setShowDialog } from '../redux/phoneSlice';
import { USER_DIALOG_STATUS } from '../types/enums';

export default function UploadCasePage() {
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((s) => s.upload);
    const isLoggedIn = useAppSelector((s) => s.user.isLoggedIn);

    const [form, setForm] = useState({
        jtitle: '',
        jyear: '',
        plaintiff: '',
        defendant: '',
        rent: '',
        city: '',
        win: 'plaintiff',
        jfull: '',
    });

    const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [key]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) {
            dispatch(setShowDialog(USER_DIALOG_STATUS.PHONE_AUTH));
            return;
        }
        dispatch(uploadCase({ ...form, rent: Number(form.rent) }));
    };

    const handleClose = () => {
        dispatch(resetStatus());
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                上傳案例
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}
            >
                <TextField label="案由" value={form.jtitle} onChange={handleChange('jtitle')} required />
                <TextField label="年度" value={form.jyear} onChange={handleChange('jyear')} required />
                <TextField label="原告" value={form.plaintiff} onChange={handleChange('plaintiff')} required />
                <TextField label="被告" value={form.defendant} onChange={handleChange('defendant')} required />
                <TextField label="租金" type="number" value={form.rent} onChange={handleChange('rent')} required />
                <TextField label="地區" value={form.city} onChange={handleChange('city')} required />
                <TextField
                    select
                    label="勝訴方"
                    value={form.win}
                    onChange={handleChange('win')}
                >
                    <MenuItem value="plaintiff">原告</MenuItem>
                    <MenuItem value="defendant">被告</MenuItem>
                </TextField>
                <TextField
                    label="判決全文"
                    value={form.jfull}
                    onChange={handleChange('jfull')}
                    multiline
                    minRows={3}
                />
                <Button type="submit" variant="contained" disabled={status === 'loading'}>
                    送出
                </Button>
            </Box>
            <Snackbar open={status === 'succeeded'} autoHideDuration={2000} onClose={handleClose}>
                <Alert severity="success" onClose={handleClose} sx={{ width: '100%' }}>
                    上傳成功
                </Alert>
            </Snackbar>
            <Snackbar open={status === 'failed'} autoHideDuration={2000} onClose={handleClose}>
                <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
}
