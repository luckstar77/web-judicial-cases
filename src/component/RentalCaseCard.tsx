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
    jtitle: string;
    search: string;
};

function RentalCaseCard(props: Props) {
    const { plaintiff, defendant, rent, city, win, jyear, jtitle, search } =
        props;
    const isWinPlaintiff = win === 'plaintiff' && search === plaintiff;
    const isWinDefendant = win === 'defendant' && search === defendant;
    const cardStyle = {
        backgroundColor: isWinPlaintiff || isWinDefendant ? '#00ff02' : 'red',
    };

    return (
        <Card sx={{ maxWidth: 400 }} style={cardStyle}>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    <strong>案由：</strong> {jtitle}
                </Typography>
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
