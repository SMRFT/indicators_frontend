import React from 'react';
import CommonRawDataForm from '../Common/CommonRawDataForm';

const SICURawData = (props) => {
    return (
        <CommonRawDataForm
            title="SICU"
            endpoint="SICURawData/"
            {...props}
        />
    );
};

export default SICURawData;
