import React, { useState, useEffect } from 'react';
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
    const [submitDisabled, setSubmitDisabled] = useState(false);
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

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
            const files = Array.from(e.target.files);
            setForm({ ...form, images: files });
            const urls = files.map((f) => URL.createObjectURL(f));
            setImagePreviews(urls);
        }
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    useEffect(() => {
        if (status === 'failed') {
            setSubmitDisabled(false);
        }
    }, [status]);

    useEffect(() => {
        return () => {
            dispatch(resetStatus());
            setSubmitDisabled(false);
        };
    }, [dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) {
            dispatch(setShowDialog(USER_DIALOG_STATUS.PHONE_AUTH));
            return;
        }
        setSubmitDisabled(true);
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
                    label="黑名單姓名"
                    value={form.defendantName}
                    onChange={handleInputChange('defendantName')}
                    required
                />
                <TextField
                    label="黑名單電話"
                    value={form.defendantPhone}
                    onChange={handleInputChange('defendantPhone')}
                />
                <TextField
                    label="黑名單身分證字號"
                    value={form.defendantIdNo}
                    onChange={handleInputChange('defendantIdNo')}
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
                {imagePreviews.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                        {imagePreviews.map((src, idx) => (
                            <Box
                                key={idx}
                                component="img"
                                src={src}
                                sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                            />
                        ))}
                    </Box>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    disabled={status === 'loading' || submitDisabled}
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
