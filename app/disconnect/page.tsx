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

  const { ready, authenticated, user, unlinkEmail, unlinkWallet, unlinkPhone, unlinkGoogle, unlinkTwitter, unlinkDiscord } = usePrivy();

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
              unlinkTwitter(usernameOrId);
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
    [unlinkEmail, unlinkWallet, unlinkPhone, unlinkGoogle, unlinkTwitter, unlinkDiscord, address, upsertUser]
  );

  useEffect(() => {
    const type = searchParams.get('type');
    const address = searchParams.get('address');
    const usernameOrId = searchParams.get('usernameOrId');

    if (!user || unlinked) {
      console.log('No user');
      return;
    }

    unlinkedAcct(type, usernameOrId);
  }, [user, searchParams, unlinkWallet, unlinkEmail, unlinkPhone, unlinkGoogle, unlinkTwitter, unlinkDiscord, unlinkedAcct, unlinked]);

  return (
    <>
      {unlinked}
      {unlinked && <div>Successfully unlinked</div>}
      <div>Type: {type}</div>
      <div>Address: {address}</div>
    </>
  );
};

export default DisconnectClient;
