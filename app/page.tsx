'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
// import WebApp from '@twa-dev/sdk';
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
  const { ready, authenticated, user } = usePrivy();
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

  // useEffect(() => {
  //   if (WebApp.initDataUnsafe.user) {
  //     console.log(WebApp.initDataUnsafe.user);
  //     setUserData(WebApp.initDataUnsafe.user as UserData);
  //   }
  // }, []);

  //   const { login } = useLogin();

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;

  const googleSubject = user?.google?.subject || null;
  const twitterSubject = user?.twitter?.subject || null;
  const discordSubject = user?.discord?.subject || null;

  const upsertUser = useCallback(async () => {
    if (!user) return;

    try {
      const response = await axios.post('https://walrus-app-zidja.ondigitalocean.app/user', {
        userId: user?.id,
      });

      import('@twa-dev/sdk').then((WebApp) => {
        WebApp.default.close();
      });

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error making post request:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!ready || !authenticated) return;

    upsertUser();
    // WebApp.close();
  }, [ready, authenticated, upsertUser]);

  return <main>Creating Account...</main>;
}
