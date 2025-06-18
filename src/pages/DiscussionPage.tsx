import React, { useEffect, useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import CaseCardList from '../component/CaseCardList';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCaseList } from '../redux/caseSlice';
import UploadCasePage from './UploadCasePage';

export default function DiscussionPage() {
    const dispatch = useAppDispatch();
    const cases = useAppSelector((s) => s.cases.list);
    const [showUpload, setShowUpload] = useState(false);

    useEffect(() => {
        dispatch(fetchCaseList({}));
    }, [dispatch]);

    return (
        <Box sx={{ mt: '-48px', p: 2 }}>
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
                        討論區
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mb: 2 }}
                        onClick={() => setShowUpload(true)}
                    >
                        上傳案例
                    </Button>
                    <CaseCardList items={cases} />
                </>
            )}
        </Box>
    );
}
