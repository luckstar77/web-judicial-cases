import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Box,
    Button,
    Snackbar,
    Alert,
    Fab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { uploadCase, resetStatus } from '../redux/uploadSlice';
import { setShowDialog } from '../redux/phoneSlice';
import { USER_DIALOG_STATUS } from '../types/enums';
import { cities, twDistricts } from '../lib/twDistricts';

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
        location: string;
        district: string;
        images: File[];
    }>({
        title: '',
        content: '',
        defendantName: '',
        defendantPhone: '',
        defendantIdNo: '',
        location: '',
        district: '',
        images: [],
    });

    const handleInputChange =
        (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm({ ...form, [key]: e.target.value });
        };

    const handleSelectChange =
        (key: string) => (e: SelectChangeEvent<string>) => {
            setForm({ ...form, [key]: e.target.value });
        };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setForm({ ...form, images: Array.from(e.target.files) });
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
            <Fab
                color="primary"
                aria-label="close"
                onClick={handleBack}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000,
                }}
            >
                <CloseIcon />
            </Fab>
            <Typography variant="h4" gutterBottom textAlign="center">
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
                    mx: 'auto',
                }}
            >
                <TextField
                    label="標題"
                    value={form.title}
                    onChange={handleInputChange('title')}
                    required
                />
                <TextField
                    label="內容"
                    value={form.content}
                    onChange={handleInputChange('content')}
                    multiline
                    rows={4}
                    required
                />
                <TextField
                    label="被告姓名"
                    value={form.defendantName}
                    onChange={handleInputChange('defendantName')}
                    required
                />
                <TextField
                    label="被告電話"
                    value={form.defendantPhone}
                    onChange={handleInputChange('defendantPhone')}
                    required
                />
                <TextField
                    label="被告身分證字號"
                    value={form.defendantIdNo}
                    onChange={handleInputChange('defendantIdNo')}
                    required
                />
                <FormControl fullWidth>
                    <InputLabel id="location-label">縣市</InputLabel>
                    <Select
                        labelId="location-label"
                        value={form.location}
                        label="縣市"
                        onChange={handleSelectChange('location')}
                    >
                        {cities.map((c) => (
                            <MenuItem key={c} value={c}>
                                {c}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth disabled={!form.location}>
                    <InputLabel id="district-label">鄉鎮市區</InputLabel>
                    <Select
                        labelId="district-label"
                        value={form.district}
                        label="鄉鎮市區"
                        onChange={handleSelectChange('district')}
                    >
                        {(twDistricts[form.location] || []).map((d) => (
                            <MenuItem key={d} value={d}>
                                {d}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" component="label">
                    上傳圖片
                    <input
                        hidden
                        multiple
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
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
