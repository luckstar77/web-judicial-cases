import React from 'react';
import { Box, Typography } from '@mui/material';
import CaseCard from './CaseCard';

type Props = {
    items: any[];
    search: string;
};

const CaseList: React.FC<Props> = ({ items }) => {
    if (items.length === 0) {
        return (
            <Typography gutterBottom variant="h5" component="h2">
                查無資料
            </Typography>
        );
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            {items.map((item) => (
                <CaseCard key={item.id} item={item} />
            ))}
        </Box>
    );
};

export default CaseList;
