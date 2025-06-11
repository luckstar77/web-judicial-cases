import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    IconButton,
    Typography,
    useTheme,
    CircularProgress,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    Comment as CommentIcon,
    Balance as BalanceIcon,
} from '@mui/icons-material';
import WinnerTypo from './WinnerTypo';
import { fetchComments, selectCommentsByFileset } from '../redux/commentSlice';
import { fetchLikeCount, fetchLikeStatus, toggleLike } from '../redux/likeSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setShowDialog } from '../redux/phoneSlice';
import { USER_DIALOG_STATUS } from '../types/enums';



type Props = {
    plaintiff: string;
    defendant: string;
    rent: number;
    city: string;
    win: string;
    jyear: string;
    jtitle: string;
    search: string;
    id: number; // 新增 filesetId (judicialFileset.id)
    onCommentClick?: (id: number) => void; // 點擊事件
};

export default function OutlinedCard(props: Props) {
    // 在元件內部
    const theme = useTheme();
    const { plaintiff, defendant, rent, city, win, jyear, jtitle, search, id, onCommentClick } =
        props;
    // 從 Redux 讀取此 fileset 的留言列表，並取長度
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((s) => s.user?.isLoggedIn);
    const comments = useAppSelector(selectCommentsByFileset(id));
    const commentCount = comments.length;
    const isWinPlaintiff = win === 'plaintiff' && search === plaintiff;
    const isWinDefendant = win === 'defendant' && search === defendant;
    const cardStyle = {
        backgroundColor:
            isWinPlaintiff || isWinDefendant
                ? 'grey'
                : theme.palette.primary.main,
        minWidth: 400,
        width: '50vw',
        transition: 'box-shadow 0.3s', // 添加過渡效果
        '&:hover': {
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.5)', // 滑鼠懸停時的陰影
        },
    };

    const count = useAppSelector(state => state.likes.counts[id] || 0);
    const liked = useAppSelector(state => state.likes.liked[id] || false);
    const loading = useAppSelector(state => state.likes.loading[id] || false);
    

    useEffect(() => {
        dispatch(fetchComments(id));
        dispatch(fetchLikeCount(id));
        dispatch(fetchLikeStatus(id));
    }, [dispatch, id]);

    const handleToggle = (
        e: React.MouseEvent) => {
        e.stopPropagation();      // ← 阻止冒泡
        if (!isLoggedIn) {
            dispatch(setShowDialog(USER_DIALOG_STATUS.PHONE_AUTH));
            return;
        }
        if (!loading) {
            dispatch(toggleLike({  filesetId:id }));
        }
    };

    return (
        <Card sx={cardStyle} variant="outlined">
            <CardHeader
                avatar={<BalanceIcon />}
                title={jtitle}
                subheader={`${jyear}年`}
            />
            <CardContent>
                <Typography variant="h5" component="div">
                    原告：{plaintiff} | 被告：{defendant}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    勝訴方：
                    <WinnerTypo
                        win={win}
                        plaintiff={plaintiff}
                        defendant={defendant}
                    />
                </Typography>
                <Typography variant="h6" component="div">
                    地區：{city} | 租金：{rent}
                </Typography>
            </CardContent>
            {/* // TODO: implement like and comment */}
            <CardActions disableSpacing>
                <IconButton onClick={handleToggle} disabled={loading} color={liked ? 'error' : 'default'}>
                    { loading ? <CircularProgress size={24} /> : <FavoriteIcon /> }
                    {count}
                </IconButton>
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        onCommentClick?.(id);
                    }}
                >
                    <CommentIcon />
                    {commentCount}
                </IconButton>
            </CardActions>
        </Card>
    );
}
