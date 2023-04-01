import React from 'react';
import Typography from '@mui/material/Typography';

interface Props {
    isShow: boolean;
}

const MyList = (props: Props) => {
    const { isShow } = props;

    if (isShow) {
        return null;
    }

    return (
        <Typography gutterBottom variant="h5" component="h2">
            租賃案件
        </Typography>
    );
};

export default MyList;
