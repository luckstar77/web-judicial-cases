import React, { useEffect, useState } from 'react';
import '../App.css';
import ButtonAppBar from './ButtonAppBar';
import Banner from './Banner';
import ContentList from './ContentList';
import { useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';

function App() {
    const [loading, setLoading] = useState(false);
    const dataStatus = useSelector((state: any) => state.data.status);

    return (
        <div>
            {dataStatus === 'loading' && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        zIndex: 9999,
                    }}
                >
                    <LoadingButton
                        loading
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                    >
                        Loading...
                    </LoadingButton>
                </div>
            )}
            <ButtonAppBar />
            <Banner />
            <ContentList />
        </div>
    );
}

export default App;
