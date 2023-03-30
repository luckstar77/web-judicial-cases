import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import WinnerTypo from './WinnerTypo';

type Props = {
    plaintiff: string;
    defendant: string;
    rent: number;
    city: string;
    win: string;
    jyear: string;
};

function RentalCaseCard(props: Props) {
    const { plaintiff, defendant, rent, city, win, jyear } = props;

    return (
        <Card sx={{ maxWidth: 400 }}>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    <strong>年份：</strong> {jyear}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>原告：</strong> {plaintiff}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>被告：</strong> {defendant}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>租金：</strong> {rent} 元/月
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>地區：</strong> {city}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>勝訴方：</strong>{' '}
                    <WinnerTypo
                        win={win}
                        plaintiff={plaintiff}
                        defendant={defendant}
                    />
                </Typography>
            </CardContent>
        </Card>
    );
}

export default RentalCaseCard;
