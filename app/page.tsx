// 'use client';

// import { useLogin, usePrivy } from '@privy-io/react-auth';
// import WebApp from '@twa-dev/sdk';
// import { read } from 'fs';
// import Image from 'next/image';
// import { useEffect, useState } from 'react';

// interface UserData {
//   id: number;
//   first_name: string;
//   last_name?: string;
//   username?: string;
//   language_code: string;
//   is_premium?: boolean;
// }

// export default function Home() {
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const { ready, authenticated, user } = usePrivy();

//   console.log(ready);

//   useEffect(() => {
//     if (WebApp.initDataUnsafe.user) {
//       console.log(WebApp.initDataUnsafe.user);
//       setUserData(WebApp.initDataUnsafe.user as UserData);
//     }
//   }, []);

//   const { login } = useLogin();

//   return (
//     <main>
//       test1
//       <ul>
//         <li>Ready: {ready ? 'Yes' : 'No'}</li>
//         <li>Authenticated: {authenticated ? 'Yes' : 'No'}</li>
//         <li>User: {user ? 'Yes' : 'No'}</li>
//         <li>ID: {userData?.id}</li>
//         <li>First Name: {userData?.first_name}</li>
//         <li>Last Name: {userData?.last_name || 'N/A'}</li>
//         <li>Username: {userData?.username || 'N/A'}</li>
//         <li>Language Code: {userData?.language_code}</li>
//         <li>Is Premium: {userData?.is_premium ? 'Yes' : 'No'}</li>
//       </ul>
//       <button onClick={login}>Log in</button>
//     </main>
//   );
// }

'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import WebApp from '@twa-dev/sdk';
import axios from 'axios';
import { read } from 'fs';
import Image from 'next/image';
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

  const upsertUser = useCallback(async () => {
    if (!user) return;

    try {
      const response = await axios.post('https://walrus-app-zidja.ondigitalocean.app/user', {
        userId: user?.id,
      });
      // WebApp.close();
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error making post request:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!ready || !authenticated) return;

    upsertUser();
    WebApp.close();
  }, [ready, authenticated, upsertUser]);

  return (
    <main>
      Creating Account
      {/* <button onClick={upsertUser}>upsert</button> */}
      {/* Connect <br />
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
      <button onClick={linkWallet} className='text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none'>
        Connect wallet
      </button>
      <br />
      <br />
      <button onClick={linkFarcaster} className='text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none'>
        Connect Farcaster
      </button>
      <br />
      <br />
      <button onClick={linkTwitter} className='text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none'>
        Connect Twitter
      </button> */}
    </main>
  );
}
