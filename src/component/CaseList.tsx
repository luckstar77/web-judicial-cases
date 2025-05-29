import React, { useState } from 'react';
import { Link, List, ListItem, ListItemText, Typography } from '@mui/material';
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
                <Dialog open={Boolean(selectedItem)} onClose={handleClose}>
                    <DialogTitle>案由</DialogTitle>
                    <DialogContent dividers>
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                            {selectedItem.jfull}
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* 新增 Dialog：顯示留言訊息 */}
            {openCommentId !== null && (
                <Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth>
                    <DialogTitle>留言訊息</DialogTitle>
                    <DialogContent dividers>
                        <JudicialFilesetComments filesetId={openCommentId} />
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

export default ExampleList;
