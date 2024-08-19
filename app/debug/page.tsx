'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import WebApp from '@twa-dev/sdk';

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
  const { getAccessToken } = usePrivy();

  const [launched, setLaunched] = useState(false);
  const [loginLaunched, setLoginLaunched] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

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

  const getAccessTokenFn = useCallback(async () => {
    const accessToken = await getAccessToken();
    setAccessToken(accessToken);
    console.log(accessToken);
  }, [getAccessToken]);

  useEffect(() => {
    getAccessTokenFn();
  }, [getAccessTokenFn]);

  //   useEffect(() => {
  //     if (!ready || launched) return;

  //     if (!authenticated) {
  //       if (!loginLaunched) {
  //         login({ loginMethods: ['telegram'] });
  //         setLoginLaunched(true);
  //       }

  //       return;
  //     }

  //     linkWallet();
  //     setLaunched(true);
  //   }, [linkWallet, ready, launched, authenticated, login, loginLaunched]);

  return (
    <main>
      <>
        <p>Access Token: {accessToken}</p>
        userData: {JSON.stringify(userData)} <br />
        <br />
        user: {JSON.stringify(user)} <br />
      </>
      {!authenticated && (
        <>
          <p>Please Authenticate to Continue</p>
          <button onClick={() => login({ loginMethods: ['telegram'] })}>Login</button> <br />
        </>
      )}
      {authenticated && (
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
