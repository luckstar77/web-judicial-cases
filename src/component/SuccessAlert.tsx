import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_STATUS } from '../types/enums';
import { setFetchStatus } from '../redux/phoneSlice';

export default function CustomizedSnackbars() {
    const { fetchStatus } = useSelector(
        (state: any) => state.user
    );
    const dispatch = useDispatch();
    
    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(setFetchStatus(FETCH_STATUS.NONE));
    };

    return (
        <div>
            <Snackbar open={fetchStatus === FETCH_STATUS.SUCCESS} autoHideDuration={1000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    成功
                </Alert>
            </Snackbar>
        </div>
    );
}
