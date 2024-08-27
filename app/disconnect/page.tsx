'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
// import WebApp from '@twa-dev/sdk';
import axios from 'axios';

const DisconnectClient = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const address = searchParams.get('address');
  const [unlinked, setUnlinked] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [loginLaunched, setLoginLaunched] = useState(false);

  const { ready, authenticated, user, unlinkEmail, unlinkWallet, unlinkPhone, unlinkGoogle, unlinkTwitter, unlinkDiscord, login } = usePrivy();

  useEffect(() => {
    setIsClient(true); // This ensures the code runs only on the client side
  }, []);

  const closeWindow = () => {
    if (isClient) {
      window.close();
    }
  };

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

  const unlinkedAcct = useCallback(
    async (type: any, usernameOrId: any) => {
      if (type) {
        if (type === 'wallet' && address) {
          console.log('unlinkWallet');
          unlinkEmail(usernameOrId);
          const data = await unlinkWallet(address);
          console.log('data');
          console.log(data);

          // WebApp.close();
          // if (typeof window !== 'undefined') {
          //   window.close();
          // }

          closeWindow();
          console.log('setUnlinked');
          await upsertUser();
          setUnlinked(true);
        } else if (usernameOrId) {
          switch (type) {
            case 'email':
              break;
            case 'phone':
              unlinkPhone(usernameOrId);
              break;
            case 'google':
              unlinkGoogle(usernameOrId);
              break;
            case 'twitter':
              console.log('unlinking twitter1');
              console.log(usernameOrId);
              // await unlinkTwitter(`@${usernameOrId}`);
              if (!user?.twitter?.subject) {
                console.log('No twitter subject');
                return;
              }

              await unlinkTwitter(user?.twitter?.subject);
              console.log('upserting');
              await upsertUser();
              console.log('setting unlinked');
              setUnlinked(true);
              break;
            case 'discord':
              unlinkDiscord(usernameOrId);
              break;
            default:
              console.log(`No action for type: ${type}`);
          }
        }
      }
    },
    [unlinkEmail, unlinkWallet, unlinkPhone, unlinkGoogle, unlinkTwitter, unlinkDiscord, address, upsertUser, closeWindow]
  );

  useEffect(() => {
    if (!ready || launched) return;

    if (!authenticated) {
      if (!loginLaunched) {
        login({ loginMethods: ['telegram'] });
        setLoginLaunched(true);
      }

      return;
    }

    setLaunched(true);
  }, [ready, launched, authenticated, login, loginLaunched]);

  useEffect(() => {
    const type = searchParams.get('type');
    const address = searchParams.get('address');
    const usernameOrId = searchParams.get('usernameOrId');

    if (!user || unlinked) {
      console.log('No user');
      return;
    }

    console.log(user);
    unlinkedAcct(type, usernameOrId);
  }, [user, searchParams, unlinkWallet, unlinkEmail, unlinkPhone, unlinkGoogle, unlinkTwitter, unlinkDiscord, unlinkedAcct, unlinked]);

  return (
    <>
      {!authenticated && (
        <>
          <p>Please Authenticate to Continue</p>
          <button onClick={() => login({ loginMethods: ['telegram'] })}>Login</button> <br />
        </>
      )}
      {unlinked}
      {unlinked && <div>Successfully unlinked</div>}
      <div>Type: {type}</div>
      <div>Address: {address}</div>
    </>
  );
};

export default DisconnectClient;
