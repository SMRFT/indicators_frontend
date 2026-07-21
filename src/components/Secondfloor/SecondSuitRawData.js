import React from 'react';
import CommonRawDataForm from '../Common/CommonRawDataForm';

const SecondSuitRawData = (props) => {
    return (
        <CommonRawDataForm
            title="Second Suit"
            endpoint="SecondSuitRawData/"
            {...props}
        />
    );
};

export default SecondSuitRawData;
