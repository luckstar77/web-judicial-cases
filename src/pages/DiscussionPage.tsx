import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Fab,
    TextField,
    IconButton,
    InputAdornment,
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
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
                                placeholder="請輸入完整姓名、電話、身分證字號"
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
                    {!isSearching && totalPages > 0 && (
                        <Box
                            sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}
                        >
                            <IconButton onClick={() => setPage(1)} disabled={page === 1} size="small">
                                <FirstPageIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => setPage(Math.max(1, page - 5))}
                                disabled={page <= 5}
                                size="small"
                            >
                                <KeyboardDoubleArrowLeftIcon />
                            </IconButton>
                            <IconButton onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} size="small">
                                <NavigateBeforeIcon />
                            </IconButton>
                            {(() => {
                                const pages = [] as number[];
                                let start = Math.max(1, page - 2);
                                let end = Math.min(totalPages, page + 2);
                                if (end - start < 4) {
                                    if (start === 1) {
                                        end = Math.min(totalPages, start + 4);
                                    } else if (end === totalPages) {
                                        start = Math.max(1, end - 4);
                                    }
                                }
                                for (let p = start; p <= end; p++) {
                                    pages.push(p);
                                }
                                return pages.map((p) => (
                                    <IconButton
                                        key={p}
                                        onClick={() => setPage(p)}
                                        size="small"
                                        sx={{
                                            border: p === page ? 1 : 0,
                                            borderColor: 'primary.main',
                                            borderRadius: '50%',
                                            bgcolor: p === page ? 'primary.main' : 'transparent',
                                            color: p === page ? 'white' : 'inherit',
                                            '&:hover': {
                                                bgcolor: p === page ? 'primary.light' : 'action.hover',
                                            },
                                        }}
                                    >
                                        {p}
                                    </IconButton>
                                ));
                            })()}
                            <IconButton onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} size="small">
                                <NavigateNextIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => setPage(Math.min(totalPages, page + 5))}
                                disabled={page + 5 > totalPages}
                                size="small"
                            >
                                <KeyboardDoubleArrowRightIcon />
                            </IconButton>
                            <IconButton onClick={() => setPage(totalPages)} disabled={page === totalPages} size="small">
                                <LastPageIcon />
                            </IconButton>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
}
