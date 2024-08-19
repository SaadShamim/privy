'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import WebApp from '@twa-dev/sdk';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

interface ResponseData {
  message: string;
  authHeader: string;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const { ready, authenticated, user, linkWallet, login } = usePrivy();
  const { getAccessToken } = usePrivy();

  const [launched, setLaunched] = useState(false);
  const [loginLaunched, setLoginLaunched] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);

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

  const makeRequest = async () => {
    try {
      const response = await axios.get('https://walrus-app-zidja.ondigitalocean.app/pub', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      const makePostRequest = async () => {
        console.log('making server request');
        try {
          const response = await axios.post(
            'https://walrus-app-zidja.ondigitalocean.app/privy',
            {
              /* Request payload can go here */
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log('Response:', response.data);
          setResponseData(response.data);
        } catch (error) {
          console.error('Error making post request:', error);
        }
      };

      makePostRequest();
    }
  }, [accessToken]);

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
        test...
        <p>Client Access Token: {accessToken}</p>
        <br />
        Client User Data: {JSON.stringify(user)} <br />
        <div>
          <h3>Server Response:</h3>
          <p>Message: {responseData?.message}</p>
          <p>Authorization Header: {responseData?.authHeader}</p>
        </div>
        <button onClick={makeRequest} className='text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none'>
          Make Request
        </button>
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
