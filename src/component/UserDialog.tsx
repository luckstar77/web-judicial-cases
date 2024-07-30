import React, { useState, useRef, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { PhoneAuthDialog } from './PhoneAuthDialog';
import { UserDataDialog } from './UserDataDialog';
import { USER_DIALOG_STATUS } from '../types/enums';


export function UserDialog() {

    const { showDialog } = useSelector(
        (state: any) => state.user
    );

    return (
        <div>
            {showDialog ===  USER_DIALOG_STATUS.PHONE_AUTH && (
                <PhoneAuthDialog/>
            )}
            {showDialog ===  USER_DIALOG_STATUS.USER_DATA && (
                <UserDataDialog/>
            )}

        </div>
    );
}
