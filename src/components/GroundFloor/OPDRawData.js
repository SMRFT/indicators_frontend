import React from 'react';
import CommonRawDataForm from '../Common/CommonRawDataForm';

const OPDRawData = (props) => {
    return (
        <CommonRawDataForm
            title="OPD"
            endpoint="OPDRawData/"
            {...props}
        />
    );
};

export default OPDRawData;