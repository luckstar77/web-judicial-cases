import React from 'react';
import { Container, Typography } from '@mui/material';
import ContentList from '../layout/ContentList';

export default function DiscussionPage() {
    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                討論區
            </Typography>
            <ContentList />
        </Container>
    );
}
