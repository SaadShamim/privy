'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import WebApp from '@twa-dev/sdk';

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

  const { ready, authenticated, user, linkGoogle } = usePrivy();
  const [launched, setLaunched] = useState(false);

  console.log(ready);

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      console.log(WebApp.initDataUnsafe.user);
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  //   const { login } = useLogin();

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;

  const googleSubject = user?.google?.subject || null;
  const twitterSubject = user?.twitter?.subject || null;
  const discordSubject = user?.discord?.subject || null;

  const { login } = useLogin();

  useEffect(() => {
    if (!ready || !authenticated || launched) return;

    linkGoogle();
    setLaunched(true);
  }, [linkGoogle, ready, launched, authenticated]);

  return (
    <main>
      {!authenticated && <p>you need to authenticate first</p>}
      <>
        userData: {JSON.stringify(userData)} <br />
        <br />
        user: {JSON.stringify(user)} <br />
      </>
      Connect <br />
      <br />
      <button onClick={linkGoogle} className='text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none'>
        Connect farcaster
      </button>
      <br />
      <br />
    </main>
  );
}
