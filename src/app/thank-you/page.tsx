// app/thank-you/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ThankYouPage = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlUserName = searchParams.get('username');
    if (urlUserName) {
      setUserName(urlUserName);
    } else {
      router.push('/'); // Redirect to home page if username is not found
    }
  }, [searchParams, router]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      {userName ? (
        <>
          <Typography variant="h4" gutterBottom>
            Thank You, {userName}!
          </Typography>
          <Typography variant="body1">
            We appreciate your participation. Your selected names have been successfully submitted.
          </Typography>
        </>
      ) : (
        <Typography variant="h4" gutterBottom>
          Thank You!
        </Typography>
      )}
    </Box>
  );
};

export default ThankYouPage;
