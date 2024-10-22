'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import WebApp from '@twa-dev/sdk';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import { serverUrl, PRIVY_APP_ID } from '@/app/config';

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

const CookieDisplay = () => {
  const { ready, authenticated, user, getAccessToken } = usePrivy();

  const [cookies, setCookies] = useState({});

  useEffect(() => {
    // Get all cookies as an object
    const allCookies = Cookies.get();
    setCookies(allCookies);
  }, [user]);

  return (
    <div>
      <h1>Cookies:</h1>
      <pre>{JSON.stringify(cookies, null, 2) || 'No cookies set'}</pre>
    </div>
  );
};

export default function Home() {
  const hasUpserted = useRef(false);
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('referralCode');

  const [userData, setUserData] = useState<UserData | null>(null);
  const { ready, authenticated, user, getAccessToken } = usePrivy();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    logout,
    linkEmail,
    linkWallet,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    unlinkWallet,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
    linkFarcaster,
  } = usePrivy();

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;

  const googleSubject = user?.google?.subject || null;
  const twitterSubject = user?.twitter?.subject || null;
  const discordSubject = user?.discord?.subject || null;

  const [privyIdToken, setPrivyIdToken] = useState({});

  useEffect(() => {
    // Get all cookies as an object
    const allCookies = Cookies.get();
    const idToken = allCookies['privy-id-token'];
    setPrivyIdToken(idToken);
  }, [user]);

  const upsertUser = useCallback(async () => {
    if (!user || hasUpserted.current || !privyIdToken) return;

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return;
    }

    try {
      hasUpserted.current = true;
      const response = await axios.post(
        `${serverUrl}/user`,
        {
          userId: user?.id,
          accessToken,
          privyIdToken,
          referralCode,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setServerError('success');

      // import('@twa-dev/sdk').then((WebApp) => {
      //   WebApp.default.close();
      // });

      if (typeof window !== 'undefined') {
        setTimeout(() => WebApp.close(), 3000);
      }

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error making post request:', error);
      setServerError(error instanceof Error ? error.message : String(error));
    }
  }, [user, getAccessToken, privyIdToken, referralCode]);

  useEffect(() => {
    if (!ready || !authenticated) return;

    upsertUser();
    // WebApp.close();
  }, [ready, authenticated, upsertUser]);

  return (
    <main>
      test
      <br />
      {serverUrl}
      <br />
      {PRIVY_APP_ID}
      <br />
      {serverError}
      <CookieDisplay />
    </main>
  );
}
