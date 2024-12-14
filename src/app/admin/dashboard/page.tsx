// app/admin/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface Name {
    _id?:string;
    name: string;
    type: 'boy' | 'girl';
  }

export interface Submission {
  userName: string;
  selectedNames: Name[];
}

export default function AdminDashboard() {
  const adminToken = localStorage.getItem('adminToken');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [newUserToken, setNewUserToken] = useState<string>('');
  const [girlNames, setGirlNames] = useState<Name[]>([]);
  const [boyNames, setBoyNames] = useState<Name[]>([]);
  const [selectedNames, setSelectedNames] = useState<Name[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    fetch('/api/submissions',{
        headers: { 
            'Authorization': `Bearer ${adminToken}`,            
        }, 
    })
      .then(res => res.json())
      .then(data => {
        console.log("🚀 ~ useEffect ~ data:", data)
        setSubmissions(data);
      });

    fetch('/api/names',
        {
            headers: { 
                'Authorization': `Bearer ${adminToken}`,            
            }, 
        }
    )
      .then(res => res.json())
      .then(data => {
        setGirlNames(data.girlNames);
        setBoyNames(data.boyNames);
      });
  }, []);
      

  const nameCounts = submissions.length ? submissions.reduce((acc, submission) => {
    submission.selectedNames.forEach(name => {
        console.log("🚀 ~ nameCounts ~ name:", name)    
      acc[name.name] = (acc[name.name] || 0) + 1;
    });
    return acc;
  }, {} as { [name: string]: number }): null;

  const generateToken = async () => {
    // const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.rfLI-4jWxSdD8vrbIufTcygOwWVPelbf04-iAYimMJA";
    if (!adminToken) { router.push('/admin'); return; } 
    const res = await fetch('/api/admin/generate-token', {
        method: 'POST', 
        headers: { 
            'Authorization': `Bearer ${adminToken}`,            
        }, 
    });
    if (res.status === 200) {
      const data = await res.json();
      setNewUserToken(data.token);
    } else {
      alert('Failed to generate token');
    }
  };

  const handleSelectName = (name: Name) => {
    console.log("🚀 ~ handleSelectName ~ name:", name)
    if (selectedNames.length <= 10 && !selectedNames.some(n => n._id === name._id)) {
      setSelectedNames([...selectedNames, name]);
    }
  };

  const handleSubmit = async () => {
    // Placeholder for handling admin submission if needed
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={generateToken}>Generate User Token</button>
      {newUserToken && (
        <div>
          <h2>New User Token</h2>
          <p>{newUserToken}</p>
        </div>
      )}
      <h2>Girl Names</h2>
      <ul>
        {girlNames.map(name => <li key={name._id} onClick={() => handleSelectName({ _id: name._id, name:name.name, type: 'girl' })}>{name.name}</li>)}
      </ul>
      <h2>Boy Names</h2>
      <ul>
        {boyNames.map(name => <li key={name._id} onClick={() => handleSelectName({ _id: name._id, name:name.name, type: 'boy' })}>{name.name}</li>)}
      </ul>
      <h2>Selected Names</h2>
      <ul>
        {selectedNames.map(name => <li key={name._id}>{name.name}</li>)}
      </ul>
      <button onClick={handleSubmit}>Submit</button>
      <h2>Name Counts</h2>
      <ul>
        {nameCounts && Object.entries(nameCounts).map(([name, count]) => (
          <li key={name}>{name}: {count}</li>
        ))}
      </ul>
    </div>
  );
}
