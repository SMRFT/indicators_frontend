import React from 'react';
import CommonRawDataForm from '../Common/CommonRawDataForm';

const RecoveryWardRawData = (props) => {
    return (
        <CommonRawDataForm
            title="Recovery Ward"
            endpoint="RecoverywardRawData/"
            {...props}
        />
    );
};

export default RecoveryWardRawData;
