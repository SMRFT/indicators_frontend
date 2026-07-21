import React from 'react';
import CommonRawDataForm from '../Common/CommonRawDataForm';

const FirstFloorRawData = (props) => {
    return (
        <CommonRawDataForm
            title="First Floor"
            endpoint="FirstFloorRawData/"
            {...props}
        />
    );
};

export default FirstFloorRawData;
