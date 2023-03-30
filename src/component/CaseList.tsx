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
    const [selectedItem, setSelectedItem] = useState('');

    const handleItemClick = (item: string) => {
        setSelectedItem(item);
    };

    const handleClose = () => {
        setSelectedItem('');
    };

    return (
        <>
            <List style={{ overflow: 'auto', height: '30vh' }}>
                {props.items.map((item) => (
                    <ListItemButton
                        key={item}
                        onClick={() => handleItemClick(item)}
                    >
                        <ListItemText
                            primary={
                                <Link
                                    href={`https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=${item.id}`}
                                    target="_blank"
                                >
                                    <RentalCaseCard {...item} />
                                </Link>
                            }
                        />
                    </ListItemButton>
                ))}
            </List>
            {/* <Dialog open={!!selectedItem} onClose={handleClose}>
                <DialogTitle>{selectedItem}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This is some text about {selectedItem}.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog> */}
        </>
    );
}

export default ExampleList;
