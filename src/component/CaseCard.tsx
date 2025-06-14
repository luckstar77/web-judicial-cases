import React, { useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Dialog,
    DialogContent,
    Box,
    IconButton,
    Typography,
    CircularProgress,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    Comment as CommentIcon,
    ArrowBackIosNew as ArrowBackIosNewIcon,
    ArrowForwardIos as ArrowForwardIosIcon,
} from '@mui/icons-material';
import CaseComments from './CaseComments';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
    fetchCaseLikeCount,
    fetchCaseLikeStatus,
    toggleCaseLike,
} from '../redux/caseLikeSlice';
import { selectCaseComments } from '../redux/caseCommentSlice';
import { setShowDialog } from '../redux/phoneSlice';
import { USER_DIALOG_STATUS } from '../types/enums';

export interface CaseData {
    id: number;
    defendantName: string;
    defendantPhone: string;
    defendantIdNo: string;
    images?: string[];
    imageUrls?: string[];
}

interface Props {
    item: CaseData;
}

const CaseCard: React.FC<Props> = ({ item }) => {
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((s) => s.user?.isLoggedIn);
    const comments = useAppSelector(selectCaseComments(item.id));
    const likeCount = useAppSelector((s) => s.caseLikes.counts[item.id] || 0);
    const liked = useAppSelector((s) => s.caseLikes.liked[item.id] || false);
    const loading = useAppSelector(
        (s) => s.caseLikes.loading[item.id] || false,
    );

    const images = item.imageUrls || item.images || [];
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);

    const openViewer = (idx: number) => {
        setViewerIndex(idx);
    };

    const closeViewer = () => {
        setViewerIndex(null);
    };

    const showPrev = () => {
        setViewerIndex((prev) =>
            prev !== null && images.length
                ? (prev - 1 + images.length) % images.length
                : prev,
        );
    };

    const showNext = () => {
        setViewerIndex((prev) =>
            prev !== null && images.length
                ? (prev + 1) % images.length
                : prev,
        );
    };

    useEffect(() => {
        dispatch(fetchCaseLikeCount(item.id));
        dispatch(fetchCaseLikeStatus(item.id));
    }, [dispatch, item.id]);

    const handleToggleLike = () => {
        if (!isLoggedIn) {
            dispatch(setShowDialog(USER_DIALOG_STATUS.PHONE_AUTH));
            return;
        }
        if (!loading) {
            dispatch(toggleCaseLike({ caseId: item.id }));
        }
    };

    return (
        <Card sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
            <CardHeader
                title={`被告：${item.defendantName}`}
                subheader={`電話：${item.defendantPhone} / 身分證：${item.defendantIdNo}`}
            />
            {images.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, p: 1, overflowX: 'auto' }}>
                    {images.map((src, idx) => (
                        <Box
                            key={idx}
                            component="img"
                            src={src}
                            onClick={() => openViewer(idx)}
                            sx={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                cursor: 'pointer',
                                borderRadius: 1,
                            }}
                        />
                    ))}
                </Box>
            )}
            <CardActions disableSpacing>
                <IconButton
                    onClick={handleToggleLike}
                    disabled={loading}
                    color={liked ? 'error' : 'default'}
                >
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <FavoriteIcon />
                    )}
                    <Typography sx={{ ml: 0.5 }}>{likeCount}</Typography>
                </IconButton>
                <IconButton>
                    <CommentIcon />
                    <Typography sx={{ ml: 0.5 }}>{comments.length}</Typography>
                </IconButton>
            </CardActions>
            <CardContent>
                <CaseComments caseId={item.id} />
            </CardContent>
            {images.length > 0 && (
                <Dialog open={viewerIndex !== null} onClose={closeViewer}>
                    <DialogContent>
                        {viewerIndex !== null && (
                            <Box
                                sx={{ position: 'relative', textAlign: 'center' }}
                            >
                                <IconButton
                                    onClick={showPrev}
                                    disabled={images.length <= 1}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: 0,
                                        transform: 'translateY(-50%)',
                                    }}
                                >
                                    <ArrowBackIosNewIcon />
                                </IconButton>
                                <Box
                                    component="img"
                                    src={images[viewerIndex]}
                                    sx={{ maxWidth: '80vw', maxHeight: '80vh' }}
                                />
                                <IconButton
                                    onClick={showNext}
                                    disabled={images.length <= 1}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: 0,
                                        transform: 'translateY(-50%)',
                                    }}
                                >
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </Card>
    );
};

export default CaseCard;
