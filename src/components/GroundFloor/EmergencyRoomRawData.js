import React from 'react';
import CommonRawDataForm from '../Common/CommonRawDataForm';

const EmergencyRoomRawData = (props) => {
    return (
        <CommonRawDataForm
            title="Emergency Room"
            endpoint="EmergencyRoomRawData/"
            {...props}
        />
    );
};

export default EmergencyRoomRawData;
