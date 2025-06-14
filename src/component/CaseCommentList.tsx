import React, { useEffect } from 'react';
import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Skeleton,
    Typography,
} from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
    fetchCaseComments,
    selectCaseComments,
} from '../redux/caseCommentSlice';

interface Props {
    caseId: number;
}

const CaseCommentList: React.FC<Props> = ({ caseId }) => {
    const dispatch = useAppDispatch();
    const comments = useAppSelector(selectCaseComments(caseId));
    const loading = useAppSelector((s) => s.caseComments.loading);

    useEffect(() => {
        dispatch(fetchCaseComments(caseId));
    }, [dispatch, caseId]);

    if (loading) {
        return (
            <Paper elevation={0} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    留言
                </Typography>
                <Skeleton variant="rounded" height={80} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" height={80} />
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                留言（{comments.length}）
            </Typography>
            {comments.length === 0 ? (
                <Typography color="text.secondary">目前尚無留言。</Typography>
            ) : (
                <List disablePadding>
                    {comments.map((c, idx) => (
                        <React.Fragment key={c.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <ChatBubbleIcon fontSize="small" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={c.content}
                                    secondary={
                                        <>
                                            {c.name || '匿名'} ({c.ip}) ·{' '}
                                            {new Date(
                                                c.createdAt,
                                            ).toLocaleString()}
                                        </>
                                    }
                                />
                            </ListItem>
                            {idx !== comments.length - 1 && (
                                <Divider variant="inset" />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default CaseCommentList;
