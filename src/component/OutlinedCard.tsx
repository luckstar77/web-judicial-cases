import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    IconButton,
    Typography,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    Comment as CommentIcon,
    Balance as BalanceIcon,
} from '@mui/icons-material';
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

export default function OutlinedCard(props: Props) {
    const { plaintiff, defendant, rent, city, win, jyear, jtitle, search } =
        props;
    const isWinPlaintiff = win === 'plaintiff' && search === plaintiff;
    const isWinDefendant = win === 'defendant' && search === defendant;
    const cardStyle = {
        backgroundColor: isWinPlaintiff || isWinDefendant ? '#00ff02' : 'red',
        minWidth: 400,
        width: '50vw',
        transition: 'box-shadow 0.3s', // 添加過渡效果
        '&:hover': {
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.5)', // 滑鼠懸停時的陰影
        },
    };

    return (
        <Card sx={cardStyle} variant="outlined">
            <CardHeader
                avatar={<BalanceIcon />}
                title={jtitle}
                subheader={`${jyear}年`}
            />
            <CardContent>
                <Typography variant="h5" component="div">
                    原告：{plaintiff} | 被告：{defendant}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    勝訴方：
                    <WinnerTypo
                        win={win}
                        plaintiff={plaintiff}
                        defendant={defendant}
                    />
                </Typography>
                <Typography variant="h6" component="div">
                    地區：{city} | 租金：{rent}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton>
                    <FavoriteIcon />5
                </IconButton>
                <IconButton>
                    <CommentIcon />0
                </IconButton>
                {/* 繼續放其他 IconButtons... */}
            </CardActions>
        </Card>
    );
}
