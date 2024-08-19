'use client';

import { usePrivy } from '@privy-io/react-auth';
import WebApp from '@twa-dev/sdk';

import { useEffect, useState } from 'react';

export default function Home() {
  const { ready, authenticated, user, linkTwitter, login } = usePrivy();
  const [launched, setLaunched] = useState(false);
  const [loginLaunched, setLoginLaunched] = useState(false);

  console.log(ready);

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
