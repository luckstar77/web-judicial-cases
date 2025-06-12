import React, { useState } from 'react';
import { Link, List, ListItem, ListItemText, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import OutlinedCard from './OutlinedCard';
import JudicialFilesetComments from './JudicialFilesetComments';
type Props = {
    items: any[];
    search: string;
};

type ListItemButtonProps = {
    theme?: Theme;
    onClick: () => void;
};

const ListItemButton = styled(ListItem)<ListItemButtonProps>(({ theme }) => ({
    cursor: 'pointer',
}));

function ExampleList(props: Props) {
    const { items, search } = props;
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [openCommentId, setOpenCommentId] = useState<number | null>(null);

    const handleItemClick = (item: any) => {
        setSelectedItem(item);
    };

    const handleCommentClick = (id: number) => {
        setOpenCommentId(id);
    };

    const handleClose = () => {
        setSelectedItem(null);
        setOpenCommentId(null);
    };
    if (items.length === 0)
        return (
            <Typography gutterBottom variant="h5" component="h2">
                查無資料
            </Typography>
        );

    return (
        <>
            <List style={{ overflow: 'auto' }}>
                {items.map((item) => (
                    <ListItemButton
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                    >
                        <ListItemText
                            primary={
                                // <RentalCaseCard {...item} search={search} />
                                <OutlinedCard {...item} search={search}
                                    id={item.id}
                                    onCommentClick={handleCommentClick} />
                            }
                        />
                    </ListItemButton>
                ))}
            </List>
            {selectedItem && (
                <Dialog
                    open
                    onClose={handleClose}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
      案由 / 留言
                        <Box flexGrow={1} />
                        <IconButton size="small" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent
                        dividers
                        sx={{
                            p: 0,
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            height: '60vh',
                        }}
                    >
                        {/* 左側：案例內容 */}
                        <Box
                            flex={1}
                            p={2}
                            sx={{
                                // 在 md 尺寸以上顯示 1px 實線，其他尺寸不顯示
                                borderRight: { xs: 'none', md: '1px solid' },
                                // 邊框顏色
                                borderColor: 'divider',
                                overflowY: 'auto',
                                bgcolor: 'grey.50',
                            }}
                        >
                            <Typography
                                component="pre"
                                sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.6 }}
                            >
                                {selectedItem.jfull}
                            </Typography>
                        </Box>

                        {/* 右側：留言列表與表單 */}
                        <Box
                            flex={1}
                            p={2}
                            sx={{
                                overflowY: 'auto',
                                bgcolor: 'background.paper',
                            }}
                        >
                            <JudicialFilesetComments filesetId={selectedItem.id} />
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose} variant="contained">
        關閉
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
}

export default ExampleList;
