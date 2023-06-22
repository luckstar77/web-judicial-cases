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
import RentalCaseCard from './RentalCaseCard';

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
    '&:hover': {
        backgroundColor: theme?.palette.primary.main,
        color: theme?.palette.primary.contrastText,
    },
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

    return (
        <>
            <List style={{ overflow: 'auto' }}>
                {items.map((item) => (
                    <ListItemButton
                        key={item}
                        onClick={() => handleItemClick(item)}
                    >
                        <ListItemText
                            primary={
                                <RentalCaseCard {...item} search={search} />
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
