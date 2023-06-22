import React from 'react';
import { Box } from '@mui/system';
import SearchContent from '../component/SearchContent';
import Grid from '@mui/material/Grid';

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
                    opacity: 0.5,
                    position: 'absolute',
                }}
            />
            <Box
                component="div"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <SearchContent />
            </Box>
        </Box>
    );
};

export default Banner;
