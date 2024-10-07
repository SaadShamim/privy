'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import WebApp from '@twa-dev/sdk';
import { read } from 'fs';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { ready, authenticated, user, getAccessToken } = usePrivy();

  console.log(ready);

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      console.log(WebApp.initDataUnsafe.user);
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  const numAccounts = user?.linkedAccounts?.length || 0;

  const getAccessTokenData = useCallback(async () => {
    try {
      const token = await getAccessToken();
      setAccessToken(token);
    } catch (error) {
      console.error('Failed to get access token', error);
    }
  }, [getAccessToken]);

  useEffect(() => {
    if (!ready || !authenticated) return;

    // WebApp.close();
    getAccessTokenData();
  }, [ready, authenticated, getAccessTokenData]);

  return (
    <main>
      <p>{JSON.stringify(user)}</p>
      <p>{JSON.stringify(userData)}</p>
      <p>{accessToken}</p>
    </main>
  );
}
