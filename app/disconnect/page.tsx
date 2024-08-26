'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
// import WebApp from '@twa-dev/sdk';

const DisconnectClient = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const address = searchParams.get('address');
  const [unlinked, setUnlinked] = useState(false);

  const { ready, authenticated, user, unlinkEmail, unlinkWallet, unlinkPhone, unlinkGoogle, unlinkTwitter, unlinkDiscord } = usePrivy();

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
    [unlinkEmail, unlinkWallet, unlinkPhone, unlinkGoogle, unlinkTwitter, unlinkDiscord, address]
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
