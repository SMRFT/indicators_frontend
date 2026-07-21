import React from 'react';
import CommonRawDataForm from '../Common/CommonRawDataForm';

const ThirdFloorRawData = (props) => {
    return (
        <CommonRawDataForm
            title="Third Floor"
            endpoint="ThirdFloorRawData/"
            {...props}
        />
    );
};

export default ThirdFloorRawData;
