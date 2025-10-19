import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const GoogleLoginButton = () => {

  const handleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/googlelogin`, {
        token: googleToken,
      });

      const { token, userId } = response.data;
      localStorage.removeItem('userId');
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      window.location.href = '/homepage';
    } catch (err) {
      console.error('Google login failed', err);
      alert('Google login failed');
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => alert('Google login failed')}
    />
  );
};

export default GoogleLoginButton;
