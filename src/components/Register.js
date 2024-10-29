import React, { useState } from 'react';
import Registration from './Registration'; 

const Register = () => {
    const [role, setRole] = useState('');

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    return (
        <center>
        <div className='register-page'>
            <h2>Sign Up</h2>
            <div className='register-option'>
                <label>
                    <input
                        type="radio"
                        value="donor"
                        checked={role === 'donor'}
                        onChange={handleRoleChange}
                    />
                    As Donor
                </label>
                <label>
                    <input
                        type="radio"
                        value="recipient"
                        checked={role === 'recipient'}
                        onChange={handleRoleChange}
                    />
                    As Recipient
                </label>
                
            </div>
            {role && <Registration role={role} />} {/* Pass role to Registration */}
        </div>
        </center>
    );
};

export default Register;
