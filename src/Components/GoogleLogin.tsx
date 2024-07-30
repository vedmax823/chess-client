import React from 'react';

const LoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5001/auth/google';
  };

  return (
    <button onClick={handleLogin}>Login with Google</button>
  );
};

export default LoginButton;