import React from 'react';
import DonorRegistration from './DonorRegistration';
import RecipientRegistration from './RecipientRegistration';

const Registration = ({ role }) => {
    switch(role) {
        case 'donor':
            return <DonorRegistration />;
        case 'recipient':
            return <RecipientRegistration />;
        default:
            return null;
    }
};

export default Registration;
