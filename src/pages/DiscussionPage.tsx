import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Fab,
    TextField,
    IconButton,
    InputAdornment,
    Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CaseCardList from '../component/CaseCardList';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCaseList, searchCaseList, fetchCasePages } from '../redux/caseSlice';
import { setShowDialog } from '../redux/phoneSlice';
import { USER_DIALOG_STATUS } from '../types/enums';
import UploadCasePage from './UploadCasePage';

export default function DiscussionPage() {
    const dispatch = useAppDispatch();
    const cases = useAppSelector((s) => s.cases.list);
    const totalPages = useAppSelector((s) => s.cases.totalPages);
    const isLoggedIn = useAppSelector((s) => s.user.isLoggedIn);
    const [showUpload, setShowUpload] = useState(false);
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const handleSearch = () => {
        if (!isLoggedIn) {
            dispatch(setShowDialog(USER_DIALOG_STATUS.LOGIN));
            return;
        }
        const query = search.trim();
        if (!query) {
            if (isSearching) {
                setIsSearching(false);
                setPage(1);
                dispatch(fetchCaseList({ page: 1, pageSize }));
                dispatch(fetchCasePages({ pageSize }));
            }
            return;
        }
        dispatch(searchCaseList(query));
        setIsSearching(true);
    };

    const cancelSearch = () => {
        setSearch('');
        setIsSearching(false);
        setPage(1);
        dispatch(fetchCaseList({ page: 1, pageSize }));
        dispatch(fetchCasePages({ pageSize }));
    };


    useEffect(() => {
        if (!isSearching) {
            dispatch(fetchCaseList({ page, pageSize }));
            dispatch(fetchCasePages({ pageSize }));
        }
    }, [dispatch, page, pageSize, isSearching]);

    return (
        <Box sx={{ mt: 0, p: 2 }}>
            {showUpload ? (
                <UploadCasePage
                    onComplete={() => {
                        setShowUpload(false);
                        setPage(1);
                        dispatch(fetchCaseList({ page: 1, pageSize }));
                        dispatch(fetchCasePages({ pageSize }));
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
                    <CaseCardList items={cases} />
                    {!isSearching && totalPages > 1 && (
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            sx={{ my: 2, display: 'flex', justifyContent: 'center' }}
                        />
                    )}
                </>
            )}
        </Box>
    );
}
