import React, { useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    CardMedia,
    IconButton,
    Typography,
    CircularProgress,
    Box,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    Comment as CommentIcon,
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
    images?: string[];
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
            <CardHeader title={`被告：${item.defendantName}`} />
            {item.images && item.images.length > 0 && (
                <CardMedia
                    component="img"
                    image={item.images[0]}
                    sx={{ maxHeight: 300, objectFit: 'cover' }}
                />
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
        </Card>
    );
};

export default CaseCard;
