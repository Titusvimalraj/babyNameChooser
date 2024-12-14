// app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [girlNames, setGirlNames] = useState<string[]>([]);
  const [boyNames, setBoyNames] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (!storedToken) {
      router.push('/user/login');
    } else {
      fetch('/api/user/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: storedToken }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setToken(storedToken);
            setUserName(data.user.username);
          } else {
            router.push('/user/login');
          }
        });
    }
  }, [router]);

  useEffect(() => {
    fetch('/api/names')
      .then(res => res.json())
      .then(data => {
        setGirlNames(data.girlNames.map((n: { name: string }) => n.name));
        setBoyNames(data.boyNames.map((n: { name: string }) => n.name));
      });
  }, []);

  const handleSelectName = (name: string) => {
    if (selectedNames.length < 10 && !selectedNames.includes(name)) {
      setSelectedNames([...selectedNames, name]);
    }
  };

  const handleSubmit = async () => {
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ userName, selectedNames }),
    });
  };

  return (
    <div>
      <h1>Welcome, {userName}</h1>
      <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your Name" />
      <h2>Girl Names</h2>
      <ul>
        {girlNames.map(name => <li key={name} onClick={() => handleSelectName(name)}>{name}</li>)}
      </ul>
      <h2>Boy Names</h2>
      <ul>
        {boyNames.map(name => <li key={name} onClick={() => handleSelectName(name)}>{name}</li>)}
      </ul>
      <h2>Selected Names</h2>
      <ul>
        {selectedNames.map(name => <li key={name}>{name}</li>)}
      </ul>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
