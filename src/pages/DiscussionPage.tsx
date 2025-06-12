import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import ContentList from '../layout/ContentList';
import { useAppDispatch } from '../hooks/redux';
import { fetchData } from '../redux/dataSlice';

export default function DiscussionPage() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchData({}));
    }, [dispatch]);

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                討論區
            </Typography>
            <ContentList />
        </Container>
    );
}
