import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Fab,
    TextField,
    IconButton,
    InputAdornment,
    Snackbar,
    Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CaseCardList from '../component/CaseCardList';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCaseList, searchCaseList } from '../redux/caseSlice';
import { setShowDialog } from '../redux/phoneSlice';
import { USER_DIALOG_STATUS } from '../types/enums';
import UploadCasePage from './UploadCasePage';

export default function DiscussionPage() {
    const dispatch = useAppDispatch();
    const cases = useAppSelector((s) => s.cases.list);
    const isLoggedIn = useAppSelector((s) => s.user.isLoggedIn);
    const [showUpload, setShowUpload] = useState(false);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = () => {
        if (!isLoggedIn) {
            dispatch(setShowDialog(USER_DIALOG_STATUS.PHONE_AUTH));
            return;
        }
        dispatch(searchCaseList(search))
            .unwrap()
            .then((res) => {
                if (!res || res.length === 0) {
                    setOpen(true);
                }
            })
            .catch(() => setOpen(true));
        setIsSearching(true);
    };

    const cancelSearch = () => {
        setSearch('');
        setIsSearching(false);
        dispatch(fetchCaseList({}));
    };

    const handleClose = (_?: any, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    useEffect(() => {
        dispatch(fetchCaseList({}));
    }, [dispatch]);

    return (
        <Box sx={{ mt: 0, p: 2 }}>
            {showUpload ? (
                <UploadCasePage
                    onComplete={() => {
                        setShowUpload(false);
                        dispatch(fetchCaseList({}));
                    }}
                />
            ) : (
                <>
                    <Typography variant="h4" gutterBottom textAlign="center">
                        租屋黑名單
                    </Typography>
                    {!isLoggedIn && (
                        <Typography
                            variant="body1"
                            paragraph
                            textAlign="center"
                        >
                            會員登入後，可透過姓名、身份證或手機搜尋租屋黑名單，
                            也可以新增租屋黑名單
                        </Typography>
                    )}
                    {isLoggedIn && (
                        <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
                            <TextField
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') handleSearch();
                                }}
                                label="搜尋黑名單"
                                variant="outlined"
                                sx={{ backgroundColor: 'white', width: '100%', maxWidth: 400 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {isSearching && (
                                                <IconButton onClick={cancelSearch} aria-label="cancel">
                                                    <CloseIcon />
                                                </IconButton>
                                            )}
                                            <IconButton onClick={handleSearch} aria-label="search">
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                    )}
                    {isLoggedIn && (
                        <Fab
                            color="primary"
                            aria-label="add"
                            sx={{
                                position: 'fixed',
                                bottom: 16,
                                right: 16,
                                zIndex: 1000,
                            }}
                            onClick={() => setShowUpload(true)}
                        >
                            <AddIcon />
                        </Fab>
                    )}
                    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                            查無資料
                        </Alert>
                    </Snackbar>
                    <CaseCardList items={cases} />
                </>
            )}
        </Box>
    );
}
