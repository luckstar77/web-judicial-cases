import React, { useEffect, useState } from 'react';
import { Typography, Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
                    <CaseCardList items={cases} />
                </>
            )}
        </Box>
    );
}
