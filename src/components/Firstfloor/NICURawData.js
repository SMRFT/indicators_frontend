import React from 'react';
import CommonRawDataForm from '../Common/CommonRawDataForm';

const NICURawData = (props) => {
    return (
        <CommonRawDataForm
            title="NICU"
            endpoint="NICURawData/"
            {...props}
        />
    );
};

export default NICURawData;
