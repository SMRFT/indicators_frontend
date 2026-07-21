import React from 'react';
import CommonRawDataForm from '../Common/CommonRawDataForm';

const FirstSuitRawData = (props) => {
    return (
        <CommonRawDataForm
            title="First Suit"
            endpoint="FirstSuitRawData/"
            {...props}
        />
    );
};

export default FirstSuitRawData;
