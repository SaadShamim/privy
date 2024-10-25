'use client';

import { usePrivy } from '@privy-io/react-auth';
import WebApp from '@twa-dev/sdk';
import axios from 'axios';

import { useCallback, useEffect, useState } from 'react';
import { serverUrl } from '@/app/config';

export default function Home() {
  const { ready, authenticated, user, linkTwitter, login } = usePrivy();
  const [launched, setLaunched] = useState(false);
  const [loginLaunched, setLoginLaunched] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [initialNumAccounts, setInitialNumAccounts] = useState<null | number>(null);

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
    if (!user?.id) return;

    try {
      const response = await axios.post(
        `${serverUrl}/user`,
        {
          userId: user?.id,
          connectType: 'twitter',
        },
        {
          headers: {
            Authorization: `Bearer accessToken`,
          },
        }
      );
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
      setLinkSuccess(true);
    }
  }, [initialNumAccounts, numAccounts]);

  useEffect(() => {
    if (!ready || !authenticated || !user || !linkSuccess) return;

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
