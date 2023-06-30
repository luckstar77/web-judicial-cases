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

const YourComponent = () => {
    const cases = useSelector((state: any) => state.data.list);
    const searchCompare = useSelector((state: any) => state.data.searchCompare);
    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography gutterBottom variant="h5" component="h2">
                預警風險:
                {cases.filter(
                    (caseItem: any) =>
                        (caseItem.plaintiff === searchCompare &&
                            caseItem.win === 'defendant') ||
                        (caseItem.defendant === searchCompare &&
                            caseItem.win === 'plaintiff')
                ).length === 0
                    ? '無'
                    : cases.filter(
                        (caseItem: any) =>
                            (caseItem.plaintiff === searchCompare &&
                                  caseItem.win === 'defendant') ||
                              (caseItem.defendant === searchCompare &&
                                  caseItem.win === 'plaintiff')
                    ).length === 1
                        ? '低'
                        : cases.filter(
                            (caseItem: any) =>
                                (caseItem.plaintiff === searchCompare &&
                                  caseItem.win === 'defendant') ||
                              (caseItem.defendant === searchCompare &&
                                  caseItem.win === 'plaintiff')
                        ).length === 2
                            ? '中'
                            : '高'}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
                預警案件數:
                {
                    cases.filter(
                        (caseItem: any) =>
                            (caseItem.plaintiff === searchCompare &&
                                caseItem.win === 'defendant') ||
                            (caseItem.defendant === searchCompare &&
                                caseItem.win === 'plaintiff')
                    ).length
                }
            </Typography>
            <CaseList items={cases} search={searchCompare}></CaseList>
        </Box>
    );
};

export default YourComponent;
