import React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import SearchContent from '../component/SearchContent';

const Banner = () => {
    return (
        <Box
            component="div"
            sx={{
                width: '100%',
                height: 590,
                marginBottom: 2,
                position: 'relative',
            }}
        >
            <img
                src={process.env.PUBLIC_URL + '/banner.jpg'}
                alt="background"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.7,
                    position: 'absolute',
                }}
            />
            <SearchContent />
        </Box>
    );
};

export default Banner;
