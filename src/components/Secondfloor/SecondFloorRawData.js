import React from 'react';
import CommonRawDataForm from '../Common/CommonRawDataForm';

const SecondFloorRawData = (props) => {
    return (
        <CommonRawDataForm
            title="SecondFloor"
            endpoint="SecondFloorRawData/"
            {...props}
        />
    );
};

export default SecondFloorRawData;
