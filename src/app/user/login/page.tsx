// app/user/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserLogin() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    localStorage.setItem('userToken', token);
    router.push('/');
  };

  return (
    <div>
      <h1>User Login</h1>
      <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
