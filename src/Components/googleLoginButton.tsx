import React from 'react';

const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        window.open("http://localhost:5001/auth/google", "_self");
    };
    return (
        <button onClick={handleGoogleLogin}>Login with Google</button>
    );
};

export default GoogleLoginButton;