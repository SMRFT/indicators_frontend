import React from 'react';
import CommonRawDataForm from '../Common/CommonRawDataForm';

const MICURawData = (props) => {
    return (
        <CommonRawDataForm
            title="MICU"
            endpoint="MICURawData/"
            {...props}
        />
    );
};

export default MICURawData;
