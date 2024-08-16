'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import WebApp from '@twa-dev/sdk';
import { read } from 'fs';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
  const { ready, authenticated, user } = usePrivy();

  console.log(ready);

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      console.log(WebApp.initDataUnsafe.user);
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  const numAccounts = user?.linkedAccounts?.length || 0;

  useEffect(() => {
    if (!ready || !authenticated) return;

    // WebApp.close();
  }, [ready, authenticated]);

  return (
    <main>
      <p>{JSON.stringify(user)}</p>
    </main>
  );
}
