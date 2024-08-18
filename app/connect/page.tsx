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
  const { logout, linkEmail, linkWallet, unlinkEmail, linkPhone, unlinkPhone, unlinkWallet, linkGoogle, unlinkGoogle, linkTwitter, unlinkTwitter, linkDiscord, unlinkDiscord } =
    usePrivy();

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

  const { login } = usePrivy();

  return (
    <main>
      Connect <br />
      <button onClick={() => login({ loginMethods: ['telegram'] })}>Login</button> <br />
      <br />
      {email ? (
        <button
          onClick={() => {
            unlinkEmail(email.address);
          }}
          className='text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500'
          disabled={!canRemoveAccount}
        >
          Unlink email
        </button>
      ) : (
        <button onClick={linkEmail} className='text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white'>
          Connect email
        </button>
      )}
      <br />
      <br />
      {googleSubject ? (
        <button
          onClick={() => {
            unlinkGoogle(googleSubject);
          }}
          className='text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500'
          disabled={!canRemoveAccount}
        >
          Unlink Google
        </button>
      ) : (
        <button
          onClick={() => {
            linkGoogle();
          }}
          className='text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white'
        >
          Link Google
        </button>
      )}
      <br />
      <br />
      <button onClick={linkWallet} className='text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none'>
        Connect wallet
      </button>
    </main>
  );
}
