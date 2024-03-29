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

    const handleItemClick = (item: any) => {
        setSelectedItem(item);
    };

    const handleClose = () => {
        setSelectedItem(null);
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
                                <OutlinedCard {...item} search={search} />
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
        </>
    );
}

export default ExampleList;
