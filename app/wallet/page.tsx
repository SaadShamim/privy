'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import WebApp from '@twa-dev/sdk';
import axios from 'axios';

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

  const { ready, authenticated, user, linkWallet, login } = usePrivy();
  const [launched, setLaunched] = useState(false);
  const [loginLaunched, setLoginLaunched] = useState(false);
  const [initialNumAccounts, setInitialNumAccounts] = useState<null | number>(null);
  const [linkSuccess, setLinkSuccess] = useState(false);

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      console.log(WebApp.initDataUnsafe.user);
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;

  const googleSubject = user?.google?.subject || null;
  const twitterSubject = user?.twitter?.subject || null;
  const discordSubject = user?.discord?.subject || null;

  useEffect(() => {
    if (!ready || !numAccounts) return;

    if (initialNumAccounts !== null) {
      return;
    }

    if (numAccounts >= 1) {
      setInitialNumAccounts(numAccounts);
    }
  }, [numAccounts, initialNumAccounts, ready]);

  useEffect(() => {
    if (!initialNumAccounts || !numAccounts) return;

    if (numAccounts > initialNumAccounts) {
      setLinkSuccess(true);
    }
  }, [initialNumAccounts, numAccounts]);

  useEffect(() => {
    if (!ready || launched) return;

    if (!authenticated) {
      if (!loginLaunched) {
        login({ loginMethods: ['telegram'] });
        setLoginLaunched(true);
      }

      return;
    }

    linkWallet();
    setLaunched(true);
  }, [linkWallet, ready, launched, authenticated, login, loginLaunched]);

  const upsertUser = useCallback(async () => {
    if (!user) return;

    try {
      const response = await axios.post('https://walrus-app-zidja.ondigitalocean.app/user', {
        userId: user?.id,
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error making post request:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!ready || !authenticated || !user || !linkSuccess) return;

    upsertUser();
  }, [linkSuccess, ready, authenticated, user, upsertUser]);

  return (
    <main>
      <button onClick={upsertUser}>upsert</button>
      {/* {numAccounts} */}
      {linkSuccess && <p>Account Linked Successfully</p>}
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
      {authenticated && !linkSuccess && (
        <>
          Connect Wallet <br />
          <br />
          <button onClick={linkWallet} className='text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none'>
            Connect Wallet
          </button>
          <br />
          <br />
        </>
      )}
    </main>
  );
}
