'use client';

import { usePrivy } from '@privy-io/react-auth';
import WebApp from '@twa-dev/sdk';
import axios from 'axios';

import { useCallback, useEffect, useState } from 'react';

export default function Home() {
  const { ready, authenticated, user, linkTwitter, login } = usePrivy();
  const [launched, setLaunched] = useState(false);
  const [loginLaunched, setLoginLaunched] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [initialNumAccounts, setInitialNumAccounts] = useState<null | number>(null);

  console.log(ready);
  const numAccounts = user?.linkedAccounts?.length || 0;

  useEffect(() => {
    if (!ready || launched) return;

    if (!authenticated) {
      if (!loginLaunched) {
        login({ loginMethods: ['telegram'] });
        setLoginLaunched(true);
      }

      return;
    }

    linkTwitter();
    setLaunched(true);
  }, [linkTwitter, ready, launched, authenticated, login, loginLaunched]);

  const upsertUser = useCallback(async () => {
    console.log('upserting user1');
    if (!user?.id) return;

    console.log('upserting user');
    try {
      const response1 = await axios.get('https://walrus-app-zidja.ondigitalocean.app/test');
      console.log('Response:', response1.data);

      console.log(user?.id);
      const response = await axios.post(
        'https://walrus-app-zidja.ondigitalocean.app/user',
        {
          userId: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer accessToken`,
          },
        }
      );
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error making post request:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user?.twitter?.subject) {
      setLinkSuccess(true);
      WebApp.close();
      if (typeof window !== 'undefined' && window.close) {
        window.close();
      }
    }
  }, [user]);

  useEffect(() => {
    if (!initialNumAccounts || !numAccounts) return;

    if (numAccounts > initialNumAccounts) {
      console.log('aaa');
      setLinkSuccess(true);
    }
  }, [initialNumAccounts, numAccounts]);

  useEffect(() => {
    if (!ready || !authenticated || !user || !linkSuccess) return;

    console.log('a');
    upsertUser();
  }, [linkSuccess, ready, authenticated, user, upsertUser]);

  if (linkSuccess) {
    return (
      <main>
        <p>Success! You have connected your Twitter account.</p>
      </main>
    );
  }

  return (
    <main>
      {!authenticated && (
        <>
          <p>Please Authenticate to Continue</p>
          <button onClick={() => login({ loginMethods: ['telegram'] })}>Login</button> <br />
        </>
      )}
      {authenticated && (
        <>
          Connect Twitter <br />
          <br />
          <button onClick={linkTwitter} className='text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none'>
            Connect Twitter
          </button>
          <br />
          <br />
        </>
      )}
    </main>
  );
}
