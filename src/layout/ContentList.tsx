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
            {searchMode === 'name' && searchCompare !== '' && (
                <>
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
                </>
            )}
            {searchMode === 'condition' && (
                <>
                    <List style={{ overflow: 'auto' }}>
                        {results.map((result, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={result.name}
                                    secondary={`預警案件數：${result.count}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </Box>
    );
};

export default YourComponent;
