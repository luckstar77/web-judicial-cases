import React from 'react';

import { useSelector } from 'react-redux';
import { PhoneAuthDialog } from './PhoneAuthDialog';
import { UserDataDialog } from './UserDataDialog';
import { USER_DIALOG_STATUS } from '../types/enums';
import SuccessAlert from './SuccessAlert';


export function UserDialog() {

    const { showDialog } = useSelector((state: any) => state.user);

    return (
        <div>
            {showDialog === USER_DIALOG_STATUS.PHONE_AUTH && (
                <PhoneAuthDialog/>
            )}
            {showDialog === USER_DIALOG_STATUS.USER_DATA && (
                <UserDataDialog/>
            )}
            <SuccessAlert />
        </div>
    );
}
