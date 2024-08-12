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

  const { login } = useLogin();

  return (
    <main>
      test1
      <ul>
        <li>Ready: {ready ? 'Yes' : 'No'}</li>
        <li>Authenticated: {authenticated ? 'Yes' : 'No'}</li>
        <li>User: {user ? 'Yes' : 'No'}</li>
        <li>ID: {userData?.id}</li>
        <li>First Name: {userData?.first_name}</li>
        <li>Last Name: {userData?.last_name || 'N/A'}</li>
        <li>Username: {userData?.username || 'N/A'}</li>
        <li>Language Code: {userData?.language_code}</li>
        <li>Is Premium: {userData?.is_premium ? 'Yes' : 'No'}</li>
      </ul>
      <button onClick={login}>Log in</button>
    </main>
  );
}
