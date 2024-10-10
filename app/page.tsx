'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import WebApp from '@twa-dev/sdk';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

const serverUrl = process.env.NEXT_PUBLIC_ENV === 'productions' ? 'https://walrus-app-zidja.ondigitalocean.app/user' : 'https://0da4-199-114-252-27.ngrok-free.app/user';

export default function Home() {
  const hasUpserted = useRef(false);

  const [userData, setUserData] = useState<UserData | null>(null);
  const { ready, authenticated, user, getAccessToken } = usePrivy();

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

  const upsertUser = useCallback(async () => {
    if (!user || hasUpserted.current) return;

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return;
    }

    try {
      hasUpserted.current = true;
      const response = await axios.post(
        serverUrl,
        {
          userId: user?.id,
          accessToken,
        },
        {
          withCredentials: true,
        }
      );

      // import('@twa-dev/sdk').then((WebApp) => {
      //   WebApp.default.close();
      // });

      if (typeof window !== 'undefined') {
        setTimeout(() => WebApp.close(), 3000);
      }

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error making post request:', error);
    }
  }, [user, getAccessToken]);

  useEffect(() => {
    if (!ready || !authenticated) return;

    upsertUser();
    // WebApp.close();
  }, [ready, authenticated, upsertUser]);

  return <main>Creating Account...</main>;
}
