import React from 'react';
import { _loginWithGoogle } from '../api/api';

const Login = () => {
  const handleGoogleLogin = () => {
    _loginWithGoogle();
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to Collaborative Whiteboard</h1>
      <button onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
};

export default Login;
