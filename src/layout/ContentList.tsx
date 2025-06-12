import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import CaseList from '../component/CaseList';

const ContentList = () => {
    const cases = useSelector((state: any) => state.data.list);
    const searchCompare = useSelector((state: any) => state.data.searchCompare);

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <CaseList items={cases} search={searchCompare} />
        </Box>
    );
};

export default ContentList;
