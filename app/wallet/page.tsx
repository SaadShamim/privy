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

  const { ready, authenticated, user, linkWallet } = usePrivy();
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
    if (!ready || launched) return;

    if (!authenticated) {
      login({ loginMethods: ['telegram'] });
      return;
    }

    linkWallet();
    setLaunched(true);
  }, [linkWallet, ready, launched, authenticated, login]);

  return (
    <main>
      {!authenticated && (
        <>
          <p>Please Authenticate to Continue</p>
          <button onClick={() => login({ loginMethods: ['telegram'] })}>Login</button> <br />
        </>
      )}
      {/* <>
        userData: {JSON.stringify(userData)} <br />
        <br />
        user: {JSON.stringify(user)} <br />
      </> */}
      Connect Wallet <br />
      <br />
      <button onClick={linkWallet} className='text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none'>
        Connect Wallet
      </button>
      <br />
      <br />
    </main>
  );
}
