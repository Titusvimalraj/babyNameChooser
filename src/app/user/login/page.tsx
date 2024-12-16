// app/user/login/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const UserLogin = () => {
  const [token, setToken] = useState('');
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  const handleLogin = () => {
    if (token && userName) {
      localStorage.setItem('userToken', token);
      localStorage.setItem('userName', userName);
      router.push('/');
    } else {
      alert('Please enter a token and your name.');
    }
  };

  return (
    <div className='p-2'>
      <h1>User Login</h1>
      <TextField
        sx={{
          backgroundColor:'white'
        }}
        label="Your Name"
        variant="outlined"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        sx={{
          backgroundColor:'white'
        }}
        label="Token"
        variant="outlined"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={handleLogin}
        fullWidth
        style={{ marginTop: '16px' }}
      >
        Login
      </Button>
    </div>
  );
};

export default UserLogin;
