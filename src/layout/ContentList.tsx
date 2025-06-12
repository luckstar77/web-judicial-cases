import React from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    IconButton,
    Typography,
    Box,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    Comment as CommentIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import CaseList from '../component/CaseList';
import WarningNameList from '../component/WarningNameList';
import { List, ListItem, ListItemText } from '@mui/material';

type ApiResponse = {
    name: string;
    count: number;
};

const YourComponent = () => {
    const cases = useSelector((state: any) => state.data.list);
    const searchCompare = useSelector((state: any) => state.data.searchCompare);
    const searchMode = useSelector((state: any) => state.data.searchMode);
    const results: ApiResponse[] = useSelector(
        (state: any) => state.search.results
    );
    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <CaseList items={cases} search={searchCompare}></CaseList>
            
        </Box>
    );
};

export default YourComponent;
