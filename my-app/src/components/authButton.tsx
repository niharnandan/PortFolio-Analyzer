import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface GoogleAuthProps {
  onLoginSuccess: (response: CredentialResponse) => void;
  onLoginFailure: () => void;  // Updated to match the expected signature of onError (no arguments)
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onLoginSuccess, onLoginFailure }) => {
  return (
    <div>
      <GoogleLogin
        onSuccess={onLoginSuccess}
        onError={onLoginFailure}  // This is now the correct function signature (no arguments)
      />
    </div>
  );
};

export default GoogleAuth;
